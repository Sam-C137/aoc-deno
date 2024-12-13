async function main() {
    const text = await Deno.readTextFile("input.txt");
    const machines = text.split(/\n\s+/).map((m) => m.trim());
    const instructions = get_instructions(machines);
    let total = 0;

    for (const instruction of instructions) {
        let min_score = Infinity;
        const {
            button_a: [ax, ay],
            button_b: [bx, by],
            target: [px, py],
        } = instruction;
        for (let i = 0; i <= 100; i++) {
            for (let j = 0; j <= 100; j++) {
                if (ax * i + bx * j === px && ay * i + by * j === py) {
                    min_score = Math.min(min_score, i * 3 + j);
                }
            }
        }
        if (min_score !== Infinity) total += min_score;
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
        const target = lines[2].match(/\d+/g)?.map(Number) as [X, Y];
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
