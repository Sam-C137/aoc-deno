type X = number;
type Y = number;
interface Robot {
    p: [X, Y];
    v: [X, Y];
}
const WIDTH = 101;
const HEIGHT = 103;

async function main() {
    const text = await Deno.readTextFile( "input.txt");
    const robots = parse_input(text);

    let min_sf = Infinity;
    let best_iteration;

    for (let second = 0; second < WIDTH * HEIGHT; second++) {
        const results: [X, Y][] = [];

        for (const {
            p: [px, py],
            v: [vx, vy],
        } of robots) {
            const x = (((px + vx * second) % WIDTH) + WIDTH) % WIDTH;
            const y = (((py + vy * second) % HEIGHT) + HEIGHT) % HEIGHT;
            results.push([x, y]);
        }

        const vm = Math.floor((HEIGHT - 1) / 2);
        const hm = Math.floor((WIDTH - 1) / 2);

        const quad = [0, 0, 0, 0];

        for (const [px, py] of results) {
            if (px === hm || py === vm) continue;
            if (px < hm) {
                if (py < vm) {
                    quad[0]++;
                } else {
                    quad[1]++;
                }
            } else {
                if (py < vm) {
                    quad[2]++;
                } else {
                    quad[3]++;
                }
            }
        }

        const sf = quad.reduce((a, b) => a * b, 1);
        if (sf < min_sf) {
            min_sf = sf;
            best_iteration = second;
        }
    }

    return best_iteration;
}

function parse_input(text: string): Robot[] {
    return text.split(/\n/).map((t) => {
        const [p, v] = t.trim().split(" ");

        return {
            p: p.slice(2).split(",").map(Number),
            v: v.slice(2).split(",").map(Number),
        } as Robot;
    });
}

try {
    const result = await main();
    console.log(`The fewest number of secs to display a christmas tree is: ${result}`);
} catch (e) {
    console.error(e);
}
