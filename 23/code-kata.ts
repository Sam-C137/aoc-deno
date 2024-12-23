async function main() {
    const text = await Deno.readTextFile("input.txt");
    const graph = parse_input(text);
    const seen = new Set<string>();

    function find(node: string, req: Set<string>) {
        const key = JSON.stringify(Array.from(req).sort());
        if (seen.has(key)) return;
        seen.add(key);

        for (const neighbour of graph.get(node) ?? []) {
            if (req.has(neighbour)) continue;
            if (!graph.get(neighbour)?.isSupersetOf(req)) continue;
            find(neighbour, req.union(new Set([neighbour])));
        }
    }

    for (const x of graph.keys()) {
        find(x, new Set([x]));
    }

    let max = "";
    for (const s of seen) {
        max = s.length > max.length ? s : max;
    }

    return JSON.parse(max).join(",");
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
    console.log(`The password for the lan party is: ${result}`);
} catch (e) {
    console.error(e);
}
