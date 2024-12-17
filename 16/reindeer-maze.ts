import {MinHeap} from "./minheap.ts";

const START = "S";
const END = "E";
const WALL = "#";

async function main() {
    const text = await Deno.readTextFile("input.txt");
    const [grid, start] = parse_input(text);
    const pq = new MinHeap<string>();
    pq.insert([0, ...start.split(",").map(Number), 0, 1].join(","));
    const seen = new Set<string>([[...start.split(",").map(Number), 0, 1].join(",")]);

    while (pq.length) {
        const [cost, r, c, dr, dc] = pq.delete()!.split(",").map(Number);
        seen.add([r, c, dr, dc].join(","));
        if (grid[r][c] === END) {
            return cost;
        }
        for (const move of [
            [cost + 1, r + dr, c + dc, dr, dc].join(","),
            [cost + 1000, r, c, dc, -dr].join(","),
            [cost + 1000, r, c, -dc, dr].join(","),
        ]) {
            const [new_cost, nr, nc, ndr, ndc] = move.split(",").map(Number);
            if (grid[nr][nc] === WALL) continue;
            if (seen.has([nr, nc, ndr, ndc].join(","))) continue;
            pq.insert([new_cost, nr, nc, ndr, ndc].join(","));
        }
    }
}

function parse_input(text: string): [string[][], string] {
    let start;

    return [
        text.split(/\n/).map((line, idx) => {
            if (line.includes(START)) {
                start = [idx, line.indexOf(START)].join(",");
            }
            return line.trim().split("");
        }),
        start!,
    ];
}


try {
    const result = await main();
    console.log(`The shortest path cost is: ${result}`);
} catch (e) {
    console.error(e);
}
