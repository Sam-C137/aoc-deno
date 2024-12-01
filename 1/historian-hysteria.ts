async function main() {
    const text = await Deno.readTextFile("input.txt");
    const lines = text.split(/\n/);
    const list1: number[] = [];
    const list2: number[] = [];

    for (const line of lines) {
        const [l1, l2] = parse(line);
        list1.push(l1);
        list2.push(l2);
    }

    list1.sort((a, b) => a - b);
    list2.sort((a, b) => a - b);

    return list1.reduce((acc, curr, idx) => {
        const diff = Math.abs(curr - list2[idx]);
        return acc + diff;
    }, 0);
}

function parse(text: string): [number, number] {
    const split = text.split("   ");
    return [Number(split[0].trim()), Number(split[1].trim())];
}

try {
    const result = await main();
    console.log(
        `The total distance between the left list and right list is ${result}`,
    );
} catch (e) {
    console.error(e);
}
