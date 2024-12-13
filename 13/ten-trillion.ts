async function main() {
    const text = await Deno.readTextFile( "input.txt");
    const machines = text.split(/\n\s+/).map((m) => m.trim());
    const instructions = get_instructions(machines);
    let total = 0;

    for (const instruction of instructions) {
        const {
            button_a: [ax, ay],
            button_b: [bx, by],
            target: [px, py],
        } = instruction;
        // a few linear algebras later
        const ca = (px * by - py * bx) / (ax * by - ay * bx);
        const cb = (px - ax * ca) / bx;
        if (Number.isInteger(ca) && Number.isInteger(cb)) {
            total += ca * 3 + cb;
        }
    }

    return total;
}

type X = number;
type Y = number;

interface Instruction {
    button_a: [X, Y];
    button_b: [X, Y];
    target: [X, Y];
}

function get_instructions(machines: string[]): Instruction[] {
    return machines.map((m) => {
        const lines = m.split(/\n/);
        const button_a = lines[0].match(/\d+/g)?.map(Number) as [X, Y];
        const button_b = lines[1].match(/\d+/g)?.map(Number) as [X, Y];
        const target = lines[2]
            .match(/\d+/g)
            ?.map(Number)
            .map((t) => t + 10000000000000) as [X, Y];

        return {
            button_a,
            button_b,
            target,
        };
    });
}

try {
    const result = await main();
    console.log(`The total fewest possible tokens to reach the target price is: ${result}`);
} catch (e) {
    console.error(e);
}