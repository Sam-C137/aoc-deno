async function main() {
    const text = await Deno.readTextFile("input.txt");
    const [patterns, designs] = parse_input(text);
    const max_length = Math.max(...[...patterns].map((_) => _.length));

    return designs.reduce((prev, curr) => {
        if (make_pattern(curr, max_length, patterns)) {
            return prev + 1;
        }
        return prev;
    }, 0);
}

const map = new Map<string, boolean>();

function make_pattern(
    design: string,
    max_length: number,
    patterns: Set<string>,
) {
    if (map.has(design)) {
        return map.get(design);
    }

    if (design === "") {
        map.set(design, true);
        return true;
    }

    for (let i = 0; i < Math.min(max_length, design.length) + 1; i++) {
        if (
            patterns.has(design.slice(0, i)) &&
            make_pattern(design.slice(i), max_length, patterns)
        ) {
            map.set(design, true);
            return true;
        }
    }

    map.set(design, false);
    return false;
}

function parse_input(text: string): [Set<string>, string[]] {
    const [towels, patterns] = text.split(/\n\s+/).map((_) => _.trim());

    return [
        new Set(towels.split(", ")),
        patterns.split(/\n/).map((_) => _.trim()),
    ];
}

try {
    const result = await main();
    console.log(`It should have a total number of possible designs of: ${result}`);
} catch (e) {
    console.error(e);
}
