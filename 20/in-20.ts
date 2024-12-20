async function main() {
    const text = await Deno.readTextFile("input.txt");
    const { grid, start } = parse_input(text);
    const distances: number[][] = new Array(grid.length)
        .fill(null)
        .map((_) => new Array(grid[0].length).fill(-1));
    distances[start[0]][start[1]] = 0;
    const q = [start.join(",")];

    while (q.length) {
        const [r, c] = q.shift()!.split(",").map(Number);

        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;

            if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) continue;

            if (grid[nr][nc] === "#") continue;

            if (distances[nr][nc] > -1) continue;

            distances[nr][nc] = distances[r][c] + 1;
            q.push([nr, nc].join(","));
        }
    }

    let count = 0;

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === "#") continue;

            for (let radius = 2; radius < 21; radius++) {
                for (let dr = 0; dr < radius + 1; dr++) {
                    const dc = radius - dr;
                    const lookup = new Set([
                        [r + dr, c + dc].join(","),
                        [r + dr, c - dc].join(","),
                        [r - dr, c + dc].join(","),
                        [r - dr, c - dc].join(","),
                    ]);

                    for (const diff of lookup) {
                        const [nr, nc] = diff.split(",").map(Number);
                        if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) continue;
                        if (grid[nr][nc] === "#") continue;
                        if (distances[r][c] - distances[nr][nc] >= 100 + radius)
                            count++;
                    }
                }
            }
        }
    }

    return count;
}

function parse_input(text: string): {
    start: [number, number];
    end: [number, number];
    grid: string[][];
} {
    const grid = text.split(/\n/).map((_) => _.trim().split(""));

    let start, end;

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === "S") start = [r, c];
            if (grid[r][c] === "E") end = [r, c];
        }
    }

    return {
        start: start as [number, number],
        end: end as [number, number],
        grid,
    };
}

const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
] as const;

try {
    const result = await main();
    console.log(`The total moves which can save 100 picoseconds within a ~20 cheating distance are: ${result}`);
} catch (e) {
    console.error(e);
}
