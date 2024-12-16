const MOVES = new Map([
    ["<", [0, -1]],
    [">", [0, 1]],
    ["^", [-1, 0]],
    ["v", [1, 0]],
]);

async function main() {
    const text = await Deno.readTextFile("input.txt");
    const input = text.split(/\n\s+/);

    const grid = input[0]
        .replace(/#/g, "##")
        .replace(/O/g, "[]")
        .replace(/\./g, "..")
        .replace(/@/g, "@.")
        .split(/\r?\n/)
        .map((x) => x.split(""));
    const moves = input[1].replace(/[\r\n]/g, "").split("");

    let x: number | null = null, y = null;
    for (let i = 0; x === null && i < grid.length; ++i) {
        for (let j = 0; j < grid[0].length; ++j) {
            if (grid[i][j] === "@") {
                x = j;
                y = i;
                break;
            }
        }
    }

    for (const move of moves) {
        const [yOff, xOff] = MOVES.get(move) as [number, number];

        const newX: number = x! + xOff;
        const newY: number = y! + yOff;

        if (grid[newY][newX] === ".") {
            grid[newY][newX] = "@";
            grid[y!][x!] = ".";
            y = newY;
            x = newX;
            continue;
        }
        if (grid[newY][newX] === "#") {
            continue;
        }

        const [boxL_x, boxL_y, boxR_x, boxR_y] = getBoxBounds(newY, newX);

        if (shiftBox(true, boxL_y, boxL_x, boxR_y, boxR_x, yOff, xOff)) {
            shiftBox(false, boxL_y, boxL_x, boxR_y, boxR_x, yOff, xOff);
            grid[y!][x!] = ".";
            grid[newY][newX] = "@";
            y = newY;
            x = newX;
        }
    }

    let result = 0;

    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[0].length; ++j) {
            if (grid[i][j] === "[") {
                result += i * 100 + j;
            }
        }
    }

    return result;

    function shiftBox(
        dryRun: boolean,
        boxL_y: number,
        boxL_x: number,
        boxR_y: number,
        boxR_x: number,
        yOff: number,
        xOff: number,
    ) {
        const q: [number, number, string][] = [
            [boxL_y, boxL_x, "["],
            [boxR_y, boxR_x, "]"],
        ];
        const seen = new Set([toDp(boxL_x, boxL_y), toDp(boxR_x, boxR_y)]);

        if (!dryRun) {
            grid[boxL_y][boxL_x] = ".";
            grid[boxR_y][boxR_x] = ".";
        }

        while (q.length) {
            const [moveY, moveX, val] = q.pop()!;

            const newY = moveY + yOff;
            const newX = moveX + xOff;
            if (grid[newY][newX] === "#") {
                return false;
            } else {
                const [box2L_x, box2L_y, box2R_x, box2R_y] = getBoxBounds(
                    newY,
                    newX,
                );

                if (!seen.has(toDp(box2L_x, box2L_y))) {
                    seen.add(toDp(box2L_x, box2L_y));
                    seen.add(toDp(box2R_x, box2R_y));

                    q.push([box2L_y, box2L_x, "["], [box2R_y, box2R_x, "]"]);

                    if (!dryRun) {
                        grid[box2L_y][box2L_x] = ".";
                        grid[box2R_y][box2R_x] = ".";
                    }
                }
            }

            if (!dryRun) {
                grid[newY][newX] = val;
            }
        }
        return true;
    }

    function toDp(x: number, y: number) {
        return y * grid[0].length + x;
    }

    function getBoxBounds(y: number, x: number) {
        let box2L_x, box2L_y, box2R_x, box2R_y;
        if (grid[y][x] === "[") {
            box2L_x = x;
            box2L_y = y;
        } else {
            box2L_x = x - 1;
            box2L_y = y;
        }
        box2R_x = box2L_x + 1;
        box2R_y = box2L_y;

        return [box2L_x, box2L_y, box2R_x, box2R_y];
    }
}

try {
    const result = await main();
    console.log(`The gps coordinate sum is: ${result}`);
} catch (e) {
    console.error(e);
}