async function main() {
    const text = await Deno.readTextFile("input.txt");
    const passwords = text.split(/\n/).map((t) => t.trim());
    const numpad_paths = generate_numpad_paths();
    const keypad_paths = generate_keypad_paths();

    const cache: Record<string, any> = {};
    for (let i = 1; i <= 25; i++) {
        cache[i] = {};
    }
    function find_shortest(_code: string, depth: number) {
        if (depth === 0) {
            return _code.length + 1;
        }

        const cached = cache[depth][_code];
        if (cached) {
            return cached;
        }

        const code = `A${_code}A`;
        let total = 0;
        for (let i = 0; i < code.length - 1; i++) {
            const paths: string[] = keypad_paths[code[i]][code[i + 1]];
            total += Math.min(...paths.map((p) => find_shortest(p, depth - 1)));
        }

        cache[depth][_code] = total;

        return total;
    }

    let sum = 0;
    for (const _code of passwords) {
        const code = `A${_code}`;
        let total = 0;
        for (let i = 0; i < code.length - 1; i++) {
            const paths: string[] = numpad_paths[code[i]][code[i + 1]];
            total += Math.min(...paths.map((p) => find_shortest(p, 25)));
        }

        sum += total * Number(_code.slice(0, 3));
    }

    return sum;
}

const generate_numpad_paths = () => {
    const numpad = {
        7: [0, 0],
        8: [0, 1],
        9: [0, 2],
        4: [1, 0],
        5: [1, 1],
        6: [1, 2],
        1: [2, 0],
        2: [2, 1],
        3: [2, 2],
        0: [3, 1],
        A: [3, 2],
    };
    const numpad_paths: Record<string, any> = {};
    for (const [a, a_pos] of Object.entries(numpad)) {
        numpad_paths[a] = {};
        for (const [b, b_pos] of Object.entries(numpad)) {
            if (a === b) {
                numpad_paths[a][b] = [""];
                continue;
            }
            const paths = [];
            for (let i = 0; i < 2; i++) {
                let path = "";
                const dr = b_pos[0] > a_pos[0] ? 1 : -1;
                const dc = b_pos[1] > a_pos[1] ? 1 : -1;
                let [r, c] = a_pos;
                let is_good = true;
                if (i === 0 && r !== b_pos[0]) {
                    while (r !== b_pos[0] && is_good) {
                        path += dr === 1 ? "v" : "^";
                        r += dr;
                        if (r === 3 && c === 0) {
                            is_good = false;
                        }
                    }

                    while (c !== b_pos[1] && is_good) {
                        path += dc === 1 ? ">" : "<";
                        c += dc;
                        if (r === 3 && c === 0) {
                            is_good = false;
                        }
                    }
                } else if (i === 1 && c !== b_pos[1]) {
                    while (c !== b_pos[1] && is_good) {
                        path += dc === 1 ? ">" : "<";
                        c += dc;
                        if (r === 3 && c === 0) {
                            is_good = false;
                        }
                    }

                    while (r !== b_pos[0] && is_good) {
                        path += dr === 1 ? "v" : "^";
                        r += dr;
                        if (r === 3 && c === 0) {
                            is_good = false;
                        }
                    }
                }

                if (is_good && path) {
                    paths.push(path);
                }
            }
            numpad_paths[a][b] = paths;
        }
    }

    return numpad_paths;
};

const generate_keypad_paths = () => {
    const keypad = {
        "^": [0, 1],
        A: [0, 2],
        "<": [1, 0],
        v: [1, 1],
        ">": [1, 2],
    };
    const keypad_paths: Record<string, any> = {};
    for (const [a, a_pos] of Object.entries(keypad)) {
        keypad_paths[a] = {};
        for (const [b, b_pos] of Object.entries(keypad)) {
            if (a === b) {
                keypad_paths[a][b] = [""];
                continue;
            }
            const paths = [];
            for (let i = 0; i < 2; i++) {
                let path = "";
                const dr = b_pos[0] > a_pos[0] ? 1 : -1;
                const dc = b_pos[1] > a_pos[1] ? 1 : -1;
                let [r, c] = a_pos;
                let is_good = true;
                if (i === 0 && r !== b_pos[0]) {
                    while (r !== b_pos[0] && is_good) {
                        path += dr === 1 ? "v" : "^";
                        r += dr;
                        if (r === 0 && c === 0) {
                            is_good = false;
                        }
                    }

                    while (c !== b_pos[1] && is_good) {
                        path += dc === 1 ? ">" : "<";
                        c += dc;
                        if (r === 0 && c === 0) {
                            is_good = false;
                        }
                    }
                } else if (i === 1 && c !== b_pos[1]) {
                    while (c !== b_pos[1] && is_good) {
                        path += dc === 1 ? ">" : "<";
                        c += dc;
                        if (r === 0 && c === 0) {
                            is_good = false;
                        }
                    }

                    while (r !== b_pos[0] && is_good) {
                        path += dr === 1 ? "v" : "^";
                        r += dr;
                        if (r === 0 && c === 0) {
                            is_good = false;
                        }
                    }
                }

                if (is_good && path) {
                    paths.push(path);
                }
            }
            keypad_paths[a][b] = paths;
        }
    }

    return keypad_paths;
};

try {
    const result = await main();
    console.log(`The total complexity at depth 25 is: ${result}`);
} catch (e) {
    console.error(e);
}
