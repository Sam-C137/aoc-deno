type Point = `${number},${number}`;

async function main() {
    const text = await Deno.readTextFile("input.txt");
    const grid: string[][] = text
        .split(/\n/)
        .map((line) => line.trim().split(""));
    const regions = flood_fill(grid);

    return regions.reduce((prev, curr) => {
        const area = curr.size;
        return prev + area * perimeter(curr);
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
            const region = new Set<Point>([point]);
            const q: Point[] = [point];

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

function perimeter(region: Set<Point>) {
    let out = 0;

    for (const point of region) {
        const [r, c] = point.split(",").map(Number);
        out += 4;
        for (const [dr, dc] of dir) {
            if (region.has(`${r + dr},${c + dc}`)) out--;
        }
    }

    return out;
}

interface Foo<T> extends Array<T> {
    shift(): T;
}

function is_not_empty<T>(arr: T[]): arr is Foo<T> {
    return arr.length > 0;
}

try {
    const result = await main();
    console.log(`The total fence cost is: ${result}`);
} catch (e) {
    console.error(e);
}
