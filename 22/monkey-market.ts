async function main() {
    const text = await Deno.readTextFile("input.txt");
    const nums = text.split(/\n/);

    let total = 0n;

    for (const num of nums) {
        let _num = BigInt(num.trim());
        for (let i = 0; i < 2000; i++) {
            _num = step(_num);
        }
        total += _num;
    }

    return Number(total);
}

function step(num: bigint): bigint {
    num = (num ^ (num * 64n)) % 16777216n;
    num = (num ^ (num / 32n)) % 16777216n;
    num = (num ^ (num * 2048n)) % 16777216n;
    return num;
}

try {
    const result = await main();
    console.log(`The total market price is: ${result}`);
} catch (e) {
    console.error(e);
}