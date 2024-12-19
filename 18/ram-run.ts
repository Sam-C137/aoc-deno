import {MinHeap} from "../16/minheap.ts";

const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
] as const;

const GRID_SIZE = 71;
const MAX_BYTES = 1024;

async function main() {
    const text = await Deno.readTextFile("input.txt");
    const grid = get_grid(text);
    const pq = new MinHeap<string>();
    pq.insert([0, 0, 0].join(","));
    const seen = new Set<string>([[0, 0].join(",")]);
    const distances: number[][] = new Array(GRID_SIZE)
        .fill(null)
        .map((_) => new Array(GRID_SIZE).fill(Infinity));
    distances[0][0] = 0;

    while (pq.length) {
        const [d, r, c] = pq.delete()!.split(",").map(Number);

        if (r === GRID_SIZE - 1 && c === GRID_SIZE - 1) {
            return d;
        }

        if (d > distances[r][c]) continue;

        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;

            if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length)
                continue;

            if (grid[nr][nc] === "#") continue;

            if (seen.has([nr, nc].join(","))) continue;

            const nd = d + 1;
            if (nd < distances[nr][nc]) {
                distances[nr][nc] = nd;
                pq.insert([nd, nr, nc].join(","));
                seen.add([nr, nc].join(","));
            }
        }
    }
}

function get_grid(input: string): string[][] {
    const inst = input.split(/\n/).map((n) => n.trim().split(",").map(Number));

    const out: string[][] = new Array(GRID_SIZE)
        .fill(null)
        .map((_) => new Array(GRID_SIZE).fill("."));

    for (let i = 0; i < MAX_BYTES; i++) {
        const [r, c] = inst[i];
        out[r][c] = "#";
    }

    return out;
}

try {
    const result = await main();
    console.log(`The shortest path is: ${result}`);
} catch (e) {
    console.error(e);
}
