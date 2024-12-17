import {MinHeap} from "./minheap.ts";

const START = "S";
const END = "E";
const WALL = "#";

async function main() {
    const text = await Deno.readTextFile("input.txt");
    const [grid, start] = parse_input(text);
    const pq = new MinHeap<string>();
    pq.insert([0, ...start.split(",").map(Number), 0, 1].join(","));
    const lowest_cost = new Map<string, number>([
        [[...start.split(",").map(Number), 0, 1].join(","), 0],
    ]);
    const back_track = new Map<string, Set<string>>();
    let best_cost = Infinity;
    const end_states = new Set<string>();

    while (pq.length) {
        const [cost, r, c, dr, dc] = pq.delete()!.split(",").map(Number);
        if (cost > (lowest_cost.get([r, c, dr, dc].join(",")) ?? Infinity))
            continue;
        lowest_cost.set([r, c, dr, dc].join(","), cost);
        if (grid[r][c] === END) {
            if (cost > best_cost) break;
            best_cost = cost;
            end_states.add([r, c, dr, dc].join(","));
        }

        for (const move of [
            [cost + 1, r + dr, c + dc, dr, dc].join(","),
            [cost + 1000, r, c, dc, -dr].join(","),
            [cost + 1000, r, c, -dc, dr].join(","),
        ]) {
            const [new_cost, nr, nc, ndr, ndc] = move.split(",").map(Number);
            if (grid[nr][nc] === WALL) continue;
            const lowest =
                lowest_cost.get([nr, nc, ndr, ndc].join(",")) ?? Infinity;
            if (new_cost > lowest) continue;
            if (new_cost < lowest) {
                back_track.set([nr, nc, ndr, ndc].join(","), new Set<string>());
                lowest_cost.set([nr, nc, ndr, ndc].join(","), new_cost);
            }
            back_track
                .get([nr, nc, ndr, ndc].join(","))
                ?.add([r, c, dr, dc].join(","));

            pq.insert([new_cost, nr, nc, ndr, ndc].join(","));
        }
    }

    const q = Array.from(end_states);
    const seen = new Set(end_states);

    while (q.length) {
        const key = q.shift()!;
        for (const last of back_track.get(key) ?? []) {
            if (seen.has(last)) continue;
            seen.add(last);
            q.push(last);
        }
    }

    const out = new Set();

    for (const item of seen) {
        const [r, c] = item.split(",").map(Number);
        out.add([r, c].join(","));
    }

    return out.size;
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
    console.log(`The best seats have a total tile cost of: ${result}`);
} catch (e) {
    console.error(e);
}
