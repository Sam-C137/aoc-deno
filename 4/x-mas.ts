async function main() {
    const file = await Deno.readTextFile("input.txt");
    const grid: string[][] = file.split(/\n/).map(l => l.trim()).map(str => str.split(""));
    return count(grid);
}

function count(grid: string[][]): number{
    let count = 0;

    for (let i = 1; i < grid.length - 1; i++) {
        for (let j = 1; j < grid[i].length - 1; j++) {
            if(grid[i][j] !== "A") continue;

            const first = grid[i - 1][j - 1] + grid[i][j] + grid[i + 1][j + 1];
            const second = grid[i - 1][j + 1] + grid[i][j] + grid[i + 1][j - 1];

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