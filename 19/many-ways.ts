async function main() {
    const text = await Deno.readTextFile("input.txt");
    const [patterns, designs] = parse_input(text);
    const max_length = Math.max(...[...patterns].map((_) => _.length));

    return designs.reduce((prev, curr) => {
        return prev + make_pattern(curr, max_length, patterns);
    }, 0);
}

const map = new Map<string, number>();

function make_pattern(
    design: string,
    max_length: number,
    patterns: Set<string>,
) {
    if (map.has(design)) {
        return map.get(design) ?? 0;
    }

    if (design === "") {
        map.set(design, 1);
        return 1;
    }

    let count = 0;

    for (let i = 0; i < Math.min(max_length, design.length) + 1; i++) {
        if (patterns.has(design.slice(0, i))) {
            count += make_pattern(design.slice(i), max_length, patterns);
        }
    }

    map.set(design, count);
    return count;
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
    console.log(`It should have a total number of distinct ways to make designs of: ${result}`);
} catch (e) {
    console.error(e);
}
