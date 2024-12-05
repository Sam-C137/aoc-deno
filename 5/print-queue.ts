async function main() {
    const text = await Deno.readTextFile("input.txt");
    const [ordering, updates] = text.split(/\n\s+/);
    const dict = parse_ordering(ordering);
    const valid_updates: number[][] = [];

    updates.split(/\n/).forEach((u) => {
        const update = u.split(",").map(Number);
        const is_valid = update.every((u, idx) => {
            const lookup = dict.get(u);
            return update
                .slice(idx + 1)
                .every((item) => lookup?.includes(item));
        });
        if (is_valid) valid_updates.push(update);
    });

    return valid_updates.reduce((prev, curr) => {
        return prev + curr[Math.floor(curr.length / 2)];
    }, 0);
}

function parse_ordering(o: string): Map<number, number[]> {
    const ordering = o
        .split(/\n/)
        .map((o) => o.trim())
        .map((o) => o.split("|"))
        .map((o) => o.map(Number)) as [number, number][];

    const dict = new Map<number, number[]>();
    for (const [x, y] of ordering) {
        dict.set(x, dict.has(x) ? [...(dict.get(x) ?? []), y] : [y]);
    }
    return dict;
}

try {
    const result = await main();
    console.log(
        `The total sum of middle numbers of valid updates are ${result}`,
    );
} catch (e) {
    console.error(e);
}
