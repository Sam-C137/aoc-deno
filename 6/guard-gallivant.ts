const OBSTACLE = "#";
const GUARD = "^";

interface Point {
    x: number;
    y: number;
}

async function main() {
    const text = await Deno.readTextFile("input.txt");
    const lines = text.split(/\n/).map((l) => l.trim());
    const seen: boolean[][] = [];
    const path: Point[] = [];
    const [maze, start] = get_maze(lines);

    for (let i = 0; i < maze.length; i++) {
        seen.push(new Array(maze[0].length).fill(false));
    }

    walk(maze, start, seen, path);

    // debug(maze, path)

    return seen.reduce((prev, curr) => {
        return prev + curr.filter(Boolean).length;
    }, 0);
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

function debug(maze: string[][], path: Point[]) {
    function drawPath(data: string[][], path: Point[]) {
        path.forEach((p) => {
            if (data[p.y] && data[p.y][p.x]) {
                data[p.y][p.x] = "X";
            }
        });
        return data.map((d) => d.join(""));
    }
    console.log(JSON.stringify(drawPath(maze, path), null, 2));
}

try {
    const result = await main();
    console.log(
        `The total number of distinct positions the guard moves are ${result}`,
    );
} catch (e) {
    console.error(e);
}
