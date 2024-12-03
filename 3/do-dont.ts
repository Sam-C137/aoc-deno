async function main() {
    const text = await Deno.readTextFile("input.txt");
    const sum: number[] = [];

    get_instruction(text)?.forEach(([a, b]) => {
        sum.push(a * b);
    });

    return sum.reduce((a, b) => a + b);
}

function get_instruction(input: string) {
    const out: [number, number][] = [];
    let should_do: boolean = true;

    input.match(/mul\(\d+,\d+\)|do\(\)|don't\(\)/g)?.forEach((inst) => {
        if (/mul\(\d+,\d+\)/.test(inst)) {
            if (should_do) {
                out.push(inst.match(/\d+/g)?.map(Number) as [number, number]);
            }
        } else {
            should_do = inst === "do()";
        }
    });

    return out;
}

try {
    const result = await main();
    console.log(`The total results of all multiplications are ${result}`);
} catch (e) {
    console.error(e);
}
