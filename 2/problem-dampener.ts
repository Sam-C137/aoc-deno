async function main() {
    const text = await Deno.readTextFile("input.txt");
    const lines = text.split(/\n/);
    const safe_rpt: number[][] = [];

    for (const line of lines) {
        const rpt = line.split(" ").map(Number);
        if (is_safe(rpt)) {
            safe_rpt.push(rpt);
            continue;
        }

        let is_still_safe = false;
        for (let i = 0; i < rpt.length; i++) {
            const temp = rpt.toSpliced(i);
            if (is_safe(temp)) {
                is_still_safe = true;
                break;
            }
        }

        if (is_still_safe) safe_rpt.push(rpt);
    }

    return safe_rpt.length;
}

function is_safe(rpt: number[]): boolean {
    if (!is_sorted(rpt)) return false;

    for (let i = 1; i < rpt.length; i++) {
        if (rpt[i] === rpt[i - 1]) return false;
        if (Math.abs(rpt[i] - rpt[i - 1]) > 3) return false;
    }

    return true;
}

function is_sorted(arr: number[]): boolean {
    if (!arr.length) return false;
    if (arr.length < 3) return true;

    if (arr[1] > arr[0]) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) return false;
        }
    } else {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > arr[i - 1]) return false;
        }
    }

    return true;
}

try {
    const result = await main();
    console.log(`The total number of safe reports are ${result}`);
} catch (e) {
    console.error(e);
}
