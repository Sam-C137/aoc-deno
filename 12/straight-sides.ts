type Point = `${number},${number}`;

async function main() {
    const text = await Deno.readTextFile("input.txt");
    const grid: string[][] = text
        .split(/\n/)
        .map((line) => line.trim().split(""));
    const regions = flood_fill(grid);

    return regions.reduce((prev, curr) => {
        const area = curr.size;
        return prev + area * sides(curr);
    }, 0);
}

const dir = [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
] as const;

function flood_fill(grid: string[][]) {
    let seen = new Set<Point>();
    const regions: Set<Point>[] = [];

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            const point: Point = `${r},${c}`;
            if (seen.has(point)) continue;
            seen.add(point);
            const char = grid[r][c];
            const region = new Set<Point>();
            const q: Point[] = [point];
            region.add(point);

            while (is_not_empty(q)) {
                const [r, c] = q.shift().split(",").map(Number);
                for (const [dr, dc] of dir) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (
                        nr < 0 ||
                        nc < 0 ||
                        nr >= grid.length ||
                        nc >= grid[0].length
                    ) {
                        continue;
                    }
                    if (grid[nr][nc] !== char) continue;
                    if (region.has(`${nr},${nc}`)) continue;
                    region.add(`${nr},${nc}`);
                    q.push(`${nr},${nc}`);
                }
            }
            seen = seen.union(region);
            regions.push(region);
        }
    }

    return regions;
}

const corner_dir = [
    [-0.5, -0.5],
    [0.5, -0.5],
    [0.5, 0.5],
    [-0.5, 0.5],
] as const;

function sides(region: Set<Point>) {
    const corners = new Set<Point>();

    for (const point of region) {
        const [r, c] = point.split(",").map(Number);
        for (const [dr, dc] of corner_dir) {
            const cr = r + dr;
            const cc = c + dc;
            corners.add(`${cr},${cc}`);
        }
    }

    let count = 0;
    for (const corner of corners) {
        const [cr, cc] = corner.split(",").map(Number);
        const config: boolean[] = [];
        for (const [dr, dc] of corner_dir) {
            const sr = cr + dr;
            const sc = cc + dc;
            config.push(region.has(`${sr},${sc}`));
        }
        const num = config.reduce((prev, curr) => {
            return prev + (curr ? 1 : 0);
        }, 0);

        if (num === 1) {
            count++;
        } else if (num === 2) {
            if (
                JSON.stringify(config) ===
                    JSON.stringify([true, false, true, false]) ||
                JSON.stringify(config) ===
                    JSON.stringify([false, true, false, true])
            ) {
                count += 2;
            }
        } else if (num === 3) {
            count++;
        }
    }

    return count;
}

interface Foo<T> extends Array<T> {
    shift(): T;
}

function is_not_empty<T>(arr: T[]): arr is Foo<T> {
    return arr.length > 0;
}

try {
    const result = await main();
    console.log(`The total fence cost after discount is: ${result}`);
} catch (e) {
    console.error(e);
}
