async function main() {
    const text = await Deno.readTextFile("input.txt");
    const map = parse_input(text);
    const values = Array.from(map).sort(([a_key], [b_key]) => {
        if (!a_key.startsWith("z") && b_key.startsWith("z")) return -1;
        if (a_key.startsWith("z") && !b_key.startsWith("z")) return 1;
        if (!a_key.startsWith("z") && !b_key.startsWith("z")) return 0;

        const num_a = Number(a_key.slice(1));
        const num_b = Number(b_key.slice(1));

        return num_b - num_a;
    });

    let out = "";

    for (const [key, val] of values) {
        if (!key.startsWith("z")) continue;
        out += val;
    }

    return parseInt(out, 2);
}

function parse_input(input: string) {
    const [initial, inst] = input.split(/\n\s+/);
    const map = new Map<string, number>();
    initial.split(/\n/).forEach((item) => {
        const [key, value] = item.trim().split(":");
        map.set(key, Number(value.trim()));
    });
    const unknown = new Map<string, [string, string, string?]>();

    for (const item of inst.split(/\n/)) {
        const operator = item.match(/XOR|OR|AND/)?.join("");
        const [left, right, to] = item
            .split(/XOR|OR|AND|->/)
            .map((i) => i.trim());
        unknown.set(to, [left, right, operator]);
    }

    function calculate(item: string) {
        if (map.has(item)) return map.get(item)!;
        const [left, right, operator] = unknown.get(item)!;
        switch (operator) {
            case "AND":
                map.set(item, calculate(left) & calculate(right));
                break;
            case "XOR":
                map.set(item, calculate(left) ^ calculate(right));
                break;
            case "OR":
                map.set(item, calculate(left) | calculate(right));
                break;
            default:
                break;
        }
        return map.get(item)!;
    }

    for (const k of unknown.keys()) {
        calculate(k);
    }

    return map;
}

try {
    const result = await main();
    console.log(`The total sum for z operations is: ${result}`);
} catch (e) {
    console.error(e);
}

