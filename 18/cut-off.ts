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
    const inst = text.split(/\n/).map((n) => n.trim().split(",").map(Number));

    for (let i = MAX_BYTES; i < inst.length; i++) {
        const grid = get_grid(inst, i);
        const seen: boolean[][] = new Array(GRID_SIZE)
            .fill(null)
            .map((_) => new Array(GRID_SIZE).fill(false));
        const path: Point[] = [];
        walk(
            { r: 0, c: 0 },
            { r: GRID_SIZE - 1, c: GRID_SIZE - 1 },
            seen,
            grid,
            path,
        );
        if (path.length < 1) return inst[i - 1].join(",");
    }
}

interface Point {
    r: number;
    c: number;
}

function walk(
    start: Point,
    end: Point,
    seen: boolean[][],
    grid: string[][],
    path: Point[],
) {
    if (
        start.r < 0 ||
        start.r >= grid.length ||
        start.c < 0 ||
        start.c >= grid[0].length
    ) {
        return false;
    }

    if (grid[start.r][start.c] === "#") {
        return false;
    }

    if (start.r === end.r && start.c === end.c) {
        path.push(end);
        return true;
    }

    if (seen[start.r][start.c]) {
        return false;
    }

    seen[start.r][start.c] = true;
    path.push(start);

    for (const [dr, dc] of directions) {
        if (
            walk(
                {
                    r: start.r + dr,
                    c: start.c + dc,
                },
                end,
                seen,
                grid,
                path,
            )
        ) {
            return true;
        }
    }

    path.pop();

    return false;
}

function get_grid(inst: number[][], max_bytes: number): string[][] {
    const out: string[][] = new Array(GRID_SIZE)
        .fill(null)
        .map((_) => new Array(GRID_SIZE).fill("."));

    for (let i = 0; i < max_bytes; i++) {
        const [r, c] = inst[i];
        out[r][c] = "#";
    }

    return out;
}

try {
    const result = await main();
    console.log(`The coordinate where any path does not reach the exit is: ${result}`);
} catch (e) {
    console.error(e);
}
