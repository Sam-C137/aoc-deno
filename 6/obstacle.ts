const OBSTACLE = "#";
const GUARD = "^";
const SPACE = ".";

interface Point {
    x: number;
    y: number;
}

async function main() {
    const text = await Deno.readTextFile("input.txt");
    const lines = text.split(/\n/).map((l) => l.trim());
    const [maze, start] = get_maze(lines);

    const seen: boolean[][] = [];
    const path: Point[] = [];

    for (let i = 0; i < maze.length; i++) {
        seen.push(new Array(maze[0].length).fill(false));
    }

    walk(maze, start, seen, path);

    let loop_count = 0;

    for (const { x, y } of path) {
        if (maze[y][x] !== SPACE) {
            continue;
        }

        maze[y][x] = OBSTACLE;

        if (loops(maze, start)) {
            loop_count++;
        }

        maze[y][x] = SPACE;
    }

    return loop_count;
}

const directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
];

function walk(
    maze: string[][],
    curr: Point,
    seen: boolean[][],
    path: Point[],
    current_direction = 0,
): void {
    if (
        curr.x < 0 ||
        curr.x >= maze[0].length ||
        curr.y < 0 ||
        curr.y >= maze.length
    ) {
        return;
    }

    if (!seen[curr.y][curr.x]) path.push(curr);
    seen[curr.y][curr.x] = true;

    const [dx, dy] = directions[current_direction];
    const next_x = curr.x + dx;
    const next_y = curr.y + dy;

    if (
        next_x >= 0 &&
        next_x < maze[0].length &&
        next_y >= 0 &&
        next_y < maze.length &&
        maze[next_y][next_x] === OBSTACLE
    ) {
        const next_direction = (current_direction + 1) % directions.length;
        current_direction = next_direction;
        const [new_dx, new_dy] = directions[next_direction];
        return walk(
            maze,
            {
                x: curr.x + new_dx,
                y: curr.y + new_dy,
            },
            seen,
            path,
            current_direction,
        );
    }

    return walk(
        maze,
        {
            x: next_x,
            y: next_y,
        },
        seen,
        path,
        current_direction,
    );
}

function loops(grid: string[][], { x, y }: Point) {
    let dy = -1;
    let dx = 0;

    const seen = new Set();

    while (true) {
        seen.add(`${y},${x},${dx},${dy}`);

        if (
            y + dy < 0 ||
            y + dy >= grid.length ||
            x + dx < 0 ||
            x + dx >= grid[0].length
        ) {
            return false;
        }

        if (grid[y + dy][x + dx] === OBSTACLE) {
            [dx, dy] = [-dy, dx];
        } else {
            y += dy;
            x += dx;
        }

        if (seen.has(`${y},${x},${dx},${dy}`)) {
            return true;
        }
    }
}

function get_maze(lines: string[]): [string[][], Point] {
    let start: Point = {
        x: 0,
        y: 0,
    };

    return [
        lines.map((l, idx) => {
            if (l.includes(GUARD))
                start = {
                    x: l.indexOf(GUARD),
                    y: idx,
                };
            return l.split("");
        }),
        start,
    ];
}

try {
    const result = await main();
    console.log(`The total number of positions that create loops: ${result}`);
} catch (e) {
    console.error(e);
}
