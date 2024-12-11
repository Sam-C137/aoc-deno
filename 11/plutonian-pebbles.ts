async function main() {
    const text = await Deno.readTextFile("input.txt");
    let stones = text.trim().split(" ").map(Number);

    for (let i = 0; i < 25; i++) {
        let out: number[] = [];
        for (const stone of stones) {
            if (stone === 0) {
                out.push(1);
                continue;
            }
            const str_stone = String(stone);
            if (str_stone.length % 2 === 0) {
                const l = str_stone.slice(0, str_stone.length / 2);
                const r = str_stone.slice(str_stone.length / 2);
                out.push(Number(l), Number(r));
            } else {
                out.push(stone * 2024);
            }
        }
        stones = out;
    }

    return stones.length;
}

try {
    const result = await main();
    console.log(`The total stones after blinking 25 times is: ${result}`);
} catch (e) {
    console.error(e);
}
