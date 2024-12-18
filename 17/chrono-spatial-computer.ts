interface Register {
    a: number;
    b: number;
    c: number;
}

async function main() {
    const text = await Deno.readTextFile("input.txt");
    let [{ a, b, c }, prog] = parse_input(text);

    let ptr = 0;
    const out: number[] = [];

    while (ptr < prog.length) {
        const inst = prog[ptr];
        const operand = prog[ptr + 1];

        switch (inst) {
            //adv
            case 0:
                a = a >> combo(operand, { a, b, c }); // a = Math.floor((a / Math.pow(2, combo(operand, {a, b, c}))))
                break;
            // bxl
            case 1:
                b = b ^ operand;
                break;
            // bst
            case 2:
                b = combo(operand, { a, b, c }) % 8;
                break;
            // jnz
            case 3:
                if (a !== 0) {
                    ptr = operand;
                    continue;
                }
                break;
            // bxc
            case 4:
                b = b ^ c;
                break;
            // out
            case 5:
                out.push(combo(operand, { a, b, c }) % 8);
                break;
            // bdv
            case 6:
                b = a >> combo(operand, { a, b, c });
                break;
            // cdv
            case 7:
                c = a >> combo(operand, { a, b, c });
                break;
            default:
                break;
        }
        ptr += 2;
    }

    return out.join(",");
}

function combo(value: number, reg: Register) {
    if (value <= 3) return value;
    if (value === 4) return reg.a;
    if (value === 5) return reg.b;
    if (value === 6) return reg.c;

    throw new Error("foo");
}

function parse_input(text: string): [Register, number[]] {
    const [register, inst] = text.split(/\n\s+/);
    const reg = register.match(/\d+/g)?.map(Number) as number[];

    return [
        {
            a: reg[0],
            b: reg[1],
            c: reg[2],
        },
        inst.match(/\d+/g)?.map(Number) as number[],
    ];
}

try {
    const result = await main();
    console.log(`The program output after running the computer is: ${result}`);
} catch (e) {
    console.error(e);
}
