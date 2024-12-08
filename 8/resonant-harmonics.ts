const SPACE = ".";

interface Point {
    r: number;
    c: number;
}

async function main() {
    const text = await Deno.readTextFile("input.txt");
    const grid = text.split(/\n/).map((str) => str.trim().split(""));
    const map = new Map<string, Point[]>();
    get_coords(grid, map);
    const antinodes = new Set<string>();

    for (const [, coords] of map) {
        for (let i = 0; i < coords.length - 1; i++) {
            for (let j = i + 1; j < coords.length; j++) {
                const { r: r1, c: c1 } = coords[i];
                const { r: r2, c: c2 } = coords[j];
                const diff: Point = {
                    r: r2 - r1,
                    c: c2 - c1,
                };

                let r = r1;
                let c = c1;

                while (
                    r >= 0 &&
                    r < grid.length &&
                    c >= 0 &&
                    c < grid[0].length
                ) {
                    antinodes.add(`${r},${c}`);
                    r += diff.r;
                    c += diff.c;
                }

                r = r1;
                c = c1;

                while (
                    r >= 0 &&
                    r < grid.length &&
                    c >= 0 &&
                    c < grid[0].length
                ) {
                    antinodes.add(`${r},${c}`);
                    r -= diff.r;
                    c -= diff.c;
                }
            }
        }
    }

    return Array.from(antinodes).filter((point) => {
        const [r, c] = point.split(",").map(Number);
        return r >= 0 && r < grid.length && c >= 0 && c < grid[0].length;
    }).length;
}

function get_coords(grid: string[][], map: Map<string, Point[]>) {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === SPACE) continue;
            const signal = grid[r][c];

            if (!map.has(signal)) {
                map.set(signal, []);
            }

            map.get(signal)?.push({
                r,
                c,
            });
        }
    }
}

try {
    const result = await main();
    console.log(`The total number of unique antinodes are: ${result}`);
} catch (e) {
    console.error(e);
}
