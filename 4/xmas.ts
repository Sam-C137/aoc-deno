async function main() {
    const text = await Deno.readTextFile("input.txt");
    const grid: string[][] = text.split(/\n/).map(l => l.trim()).map(str => str.split(""));
    return count(grid);
}

function count(grid: string[][]): number {
    const word = "XMAS";
    const reversed = word.split("").reverse().join("");
    let count = 0;
    const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [-1, 1]
    ]

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            for (const [dx, dy] of directions) {
                let sequence = "";
                const end_x = i + (word.length - 1) * dx;
                const end_y = j + (word.length - 1) * dy;

                if(end_x < 0 || end_x >= grid.length || end_y < 0 || end_y >= grid[i].length) {
                    continue;
                }

                for (let k = 0; k < word.length; k++) {
                    const x = i + k * dx;
                    const y = j + k * dy;
                    sequence += grid[x][y];
                }

                if(sequence === word || sequence === reversed) {
                    count++;
                }
            }
        }
    }

    return count;
}

try {
    const result = await main();
    console.log(`The total number of XMAS occurrences are ${result}`);
} catch (e) {
    console.error(e);
}