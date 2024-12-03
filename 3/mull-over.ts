async function main() {
    const text = await Deno.readTextFile("input.txt");
    const sum: number[] = [];

    get_instruction(text)?.forEach(([a, b]) => {
        sum.push(a * b);
    });

    return sum.reduce((a, b) => a + b);
}

function get_instruction(input: string) {
    return input.match(/mul\(\d+,\d+\)/g)?.map((inst) => inst.match(/\d+/g)?.map(Number) as [number, number]);
}

try {
    const result = await main();
    console.log(`The total results of all multiplications are ${result}`);
} catch (e) {
    console.error(e);
}
