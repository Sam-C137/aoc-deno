async function main() {
    const text = await Deno.readTextFile("input.txt");
    const lines = text.split(/\n/);
    let sum = 0;

    lines.forEach((l) => {
        const [target, nums] = get_values(l);
        if (operate(nums, target)) sum += target;
    });

    return sum;
}

function get_values(input: string): [number, number[]] {
    const split = input.split(":");

    return [
        Number(split[0].trim()),
        split[1]
            .split(" ")
            .map((str) => str.trim())
            .map(Number),
    ];
}

function operate(nums: number[], target: number, idx = 0, curr = 0): boolean {
    if (idx === nums.length) {
        return curr === target;
    }

    if (operate(nums, target, idx + 1, curr + nums[idx])) {
        return true;
    }

    if (operate(nums, target, idx + 1, curr * nums[idx])) {
        return true;
    }

    return false;
}

try {
    const result = await main();
    console.log(
        `The total sum of test values from operations that could be true are: ${result}`,
    );
} catch (e) {
    console.error(e);
}
