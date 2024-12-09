async function main() {
    const file = await Deno.readTextFile("input.txt");
    const grid: string[][] = file.split(/\n/).map(l => l.trim()).map(str => str.split(""));
    return count(grid);
}

function count(grid: string[][]): number{
    let count = 0;

    for (let r = 1; r < grid.length - 1; r++) {
        for (let c = 1; c < grid[r].length - 1; c++) {
            if(grid[r][c] !== "A") continue;

            const first = grid[r - 1][c - 1] + grid[r][c] + grid[r + 1][c + 1];
            const second = grid[r - 1][c + 1] + grid[r][c] + grid[r + 1][c - 1];

            if (
                ["MAS", "SAM"].includes(first) &&
                ["MAS", "SAM"].includes(second)
            ) {
                count++;
            }
        }
    }

    return count;
}

try {
    const result = await main();
    console.log(`The total number of X shaped MAS occurrences are ${result}`);
} catch (e) {
    console.error(e);
}