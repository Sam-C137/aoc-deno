interface Point {
    r: number;
    c: number;
}

async function main() {
    const text = await Deno.readTextFile("input.txt");
    const trail_heads = new Set<Point>();
    const grid = get_grid(text);
    mark_trail_heads(grid, trail_heads);
    let count = 0;

    for (const { r, c } of trail_heads) {
        count += score(grid, r, c);
    }

    return count;
}

function get_grid(input: string): number[][] {
    return input.split(/\n/).map((str) => str.trim().split("").map(Number));
}

function mark_trail_heads(grid: number[][], seen: Set<Point>) {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === 0)
                seen.add({
                    r,
                    c,
                });
        }
    }
}

const dir = [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
];

function score(grid: number[][], r: number, c: number) {
    const q: Point[] = [{ r, c }];
    const seen = new Set(`${r},${c}`);
    let summits = 0;

    while (q.length > 0) {
        const { c, r } = q.shift() as Point;
        for (const [dr, dc] of dir) {
            const nc = c + dc;
            const nr = r + dr;
            if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) {
                continue;
            }
            if (grid[nr][nc] - grid[r][c] !== 1) {
                continue;
            }
            if (seen.has(`${nr},${nc}`)) {
                continue;
            }
            seen.add(`${nr},${nc}`);
            if (grid[nr][nc] === 9) {
                summits++;
            } else {
                q.push({
                    c: nc,
                    r: nr,
                });
            }
        }
    }

    return summits;
}

try {
    const result = await main();
    console.log(`The total trailhead score is: ${result}`);
} catch (e) {
    console.error(e);
}
