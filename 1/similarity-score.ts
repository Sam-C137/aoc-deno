async function main() {
    const text = await Deno.readTextFile("input.txt");
    const lines = text.split(/\n/);
    const list1: number[] = [];
    const list2: number[] = [];

    for (const line of lines) {
        const [l1, l2] = parse(line);
        list1.push(l1);
        list2.push(l2);
    }

    const out: number[] = [];

    for (const item of list1) {
        out.push(similarity(item, list2));
    }

    return out.reduce((a, b) => a + b);
}

function parse(text: string): [number, number] {
    const split = text.split("   ");
    return [Number(split[0].trim()), Number(split[1].trim())];
}

function similarity(target: number, arr: number[]): number {
    let count = 0;
    for (const number of arr) {
        if (number === target) count++;
    }
    return target * count;
}

try {
    const result = await main();
    console.log(`The total similarity score is ${result}`);
} catch (e) {
    console.error(e);
}
