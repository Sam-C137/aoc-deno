interface Register {
    a: bigint;
    b: bigint;
    c: bigint;
}

async function main() {
    const text = await Deno.readTextFile("input.txt");
    const [, program] = parse_input(text);

    return Number(find_min_valid(program));
}

function parse_input(text: string): [Register, bigint[]] {
    const [register, inst] = text.split(/\n\s+/);
    const reg = register.match(/\d+/g)?.map(BigInt) as bigint[];

    return [
        {
            a: reg[0],
            b: reg[1],
            c: reg[2],
        },
        inst.match(/\d+/g)?.map(BigInt) as bigint[],
    ];
}

function simulate_computer(Aval: bigint, program: bigint[]): bigint[] {
    let A = Aval;
    let B = 0n;
    let C = 0n;
    let ptr = 0;
    const outputs: bigint[] = [];

    const combo = (ptr: number): bigint => {
        const val = program[ptr + 1];
        if (val < 4n) return val;
        if (val === 4n) return A;
        if (val === 5n) return B;
        if (val === 6n) return C;
        throw new Error("Unrecognized combo operand");
    };

    while (ptr < program.length) {
        const cmd = program[ptr];
        switch (cmd) {
            case 0n:
                A = A >> combo(ptr);
                break;
            case 1n:
                B = B ^ program[ptr + 1];
                break;
            case 2n:
                B = combo(ptr) % 8n;
                break;
            case 3n:
                if (A !== 0n) ptr = Number(program[ptr + 1]) - 2;
                break;
            case 4n:
                B = B ^ C;
                break;
            case 5n:
                outputs.push(combo(ptr) % 8n);
                break;
            case 6n:
                B = A >> combo(ptr);
                break;
            case 7n:
                C = A >> combo(ptr);
                break;
        }
        ptr += 2;
    }
    return outputs;
}

function find_min_valid(program: bigint[]): bigint {
    const valids: Record<string, boolean> = {};
    let minValid = 8n ** 17n; // large enough constant

    const check = (depth: number, score: bigint) => {
        if (depth === 16) {
            valids[score.toString()] = true;
            if (score < minValid) minValid = score;
            return;
        }
        const target = program.slice(-16).map(Number); // Derive target from the program
        for (let i = 0; i < 8; i++) {
            const newScore = BigInt(i) + 8n * score;
            const output = simulate_computer(newScore, program)[0];
            if (output === BigInt(target[15 - depth])) {
                check(depth + 1, newScore);
            }
        }
    };

    check(0, 0n);
    return minValid;
}


try {
    const result = await main();
    console.log(`The lowest possible initial value of A is: ${result}`);
} catch (e) {
    console.error(e);
}
