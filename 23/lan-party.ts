async function main() {
    const text = await Deno.readTextFile("input.txt");
    const graph = parse_input(text);
    const seen = new Set<string>();

    for (const x of graph.keys()) {
        for (const y of graph.get(x)!) {
            for (const z of graph.get(y)!) {
                if (x !== z && graph.get(z)?.has(x)) {
                    seen.add(JSON.stringify([x, y, z].sort()));
                }
            }
        }
    }

    return Array.from(seen).filter((s) =>
        JSON.parse(s).some((item: string) => item.startsWith("t")),
    ).length;
}

function parse_input(input: string): Map<string, Set<string>> {
    const graph = new Map<string, Set<string>>();

    input.split(/\n/).forEach((line) => {
        const [from, to] = line.trim().split("-");
        if (!graph.has(from)) graph.set(from, new Set());
        if (!graph.has(to)) graph.set(to, new Set());

        graph.get(from)?.add(to);
        graph.get(to)?.add(from);
    });

    return graph;
}

try {
    const result = await main();
    console.log(`The total connections which may contain the historian are: ${result}`);
} catch (e) {
    console.error(e);
}
