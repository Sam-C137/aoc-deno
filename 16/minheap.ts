export class MinHeap<T extends string | number> {
    public length: number;
    private readonly data: T[];

    constructor() {
        this.data = [];
        this.length = 0;
    }

    private validate(value: string): number[] {
        try {
            const numbers = value.split(",").map(Number);
            if (numbers.some(isNaN)) {
                throw new Error();
            }
            return numbers;
        } catch (error) {
            throw new Error("String must be of the format `{number},{number}`");
        }
    }

    private compare(a: T, b: T, operand: "<" | ">" = "<"): boolean {
        if (typeof a === "string" && typeof b === "string") {
            const aNumbers = this.validate(a);
            const bNumbers = this.validate(b);

            const minLength = Math.min(aNumbers.length, bNumbers.length);

            for (let i = 0; i < minLength; i++) {
                if (aNumbers[i] !== bNumbers[i]) {
                    return operand === "<"
                        ? aNumbers[i] < bNumbers[i]
                        : aNumbers[i] > bNumbers[i];
                }
            }

            return operand === "<"
                ? aNumbers.length < bNumbers.length
                : aNumbers.length > bNumbers.length;
        }

        return operand === "<" ? a < b : a > b;
    }

    insert(value: T): void {
        if (typeof value === "string") {
            this.validate(value);
        }

        this.data[this.length] = value;
        this.heapifyUp(this.length);
        this.length++;
    }

    delete(): T | undefined {
        if (this.length === 0) {
            return undefined;
        }

        const out = this.data[0];

        if (this.length === 1) {
            this.length--;
            return out;
        }

        this.length--;
        this.data[0] = this.data[this.length];
        this.heapifyDown(0);
        return out;
    }

    update(idx: number, nVal: T): void {
        if (idx < 0 || idx >= this.length) return;

        if (typeof nVal === "string") {
            this.validate(nVal);
        }

        const old = this.data[idx];
        this.data[idx] = nVal;

        if (this.compare(nVal, old, "<")) {
            this.heapifyUp(idx);
        } else {
            this.heapifyDown(idx);
        }
    }

    private heapifyDown(idx: number): void {
        const lIdx = this.leftChild(idx);
        const rIdx = this.rightChild(idx);

        if (idx >= this.length || lIdx >= this.length) {
            return;
        }

        const lVal = this.data[lIdx];
        const rVal = this.data[rIdx];
        const val = this.data[idx];

        if (
            rIdx < this.length &&
            this.compare(rVal, lVal, "<") &&
            this.compare(rVal, val)
        ) {
            this.data[idx] = rVal;
            this.data[rIdx] = val;
            this.heapifyDown(rIdx);
        } else if (this.compare(lVal, val, "<")) {
            this.data[idx] = lVal;
            this.data[lIdx] = val;
            this.heapifyDown(lIdx);
        }
    }

    private heapifyUp(idx: number): void {
        if (idx === 0) {
            return;
        }

        const pIdx = this.parent(idx);
        const pVal = this.data[pIdx];
        const val = this.data[idx];

        if (this.compare(val, pVal, "<")) {
            this.data[pIdx] = val;
            this.data[idx] = pVal;
            this.heapifyUp(pIdx);
        }
    }

    private parent(idx: number): number {
        return Math.floor((idx - 1) / 2);
    }

    private leftChild(idx: number): number {
        return idx * 2 + 1;
    }

    private rightChild(idx: number): number {
        return idx * 2 + 2;
    }
}
