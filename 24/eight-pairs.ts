interface Gate {
    a: string;
    b: string;
    op: string;
    output: string;
}

async function main() {
    const text = await Deno.readTextFile("input.txt");
    const { gates, input_bit_count } = parse_input(text);
    const flags = new Set<string>();
    const FAGate0s = gates.filter(is_direct).filter(is_gate("XOR"));

    for (const gate of FAGate0s) {
        const { a, b, output } = gate;
        const is_first = a === "x00" || b === "x00";
        if (is_first) {
            if (output !== "z00") {
                flags.add(output);
            }
            continue;
        } else if (output == "z00") {
            flags.add(output);
        }

        if (is_output(gate)) {
            flags.add(output);
        }
    }

    const FAGate3s = gates
        .filter(is_gate("XOR"))
        .filter((gate) => !is_direct(gate));

    for (const gate of FAGate3s) {
        if (!is_output(gate)) flags.add(gate.output);
    }

    const output_gates = gates.filter(is_output);
    for (const gate of output_gates) {
        const is_last = gate.output === `z${input_bit_count}`.padStart(3, "0");
        if (is_last) {
            if (gate.op !== "OR") {
                flags.add(gate.output);
            }
        } else if (gate.op !== "XOR") {
            flags.add(gate.output);
        }
    }

    let check_next: Gate[] = [];
    for (const gate of FAGate0s) {
        const { output } = gate;

        if (flags.has(output)) continue;

        if (output === "z00") continue;

        const matches = FAGate3s.filter(has_input(output));
        if (matches.length === 0) {
            check_next.push(gate);
            flags.add(output);
        }
    }

    for (const gate of check_next) {
        const { a } = gate;

        const intended_result = `z${a.slice(1)}`;
        const matches = FAGate3s.filter(has_output(intended_result));

        const match = matches[0];

        const to_check = [match.a, match.b];

        const or_matches = gates
            .filter(is_gate("OR"))
            .filter((gate) => to_check.includes(gate.output));

        const or_match_output = or_matches[0].output;

        const correct_output = to_check.find(
            (output) => output !== or_match_output,
        );
        flags.add(correct_output!);
    }

    const flags_arr = Array.from(flags);
    flags_arr.sort((a, b) => a.localeCompare(b));

    return flags_arr.slice(0, 8).join(",");
}

function parse_input(input: string) {
    const [initial, inst] = input.split(/\n\s+/);
    const wires: Record<string, number> = {};

    initial.split(/\n/).forEach((item) => {
        const [key, value] = item.trim().split(":");
        wires[key] = Number(value.trim());
    });

    const gates: Gate[] = [];

    for (const item of inst.split(/\n/)) {
        const op = item.match(/XOR|OR|AND/)!.join("");
        const [a, b, output] = item.split(/XOR|OR|AND|->/).map((i) => i.trim());
        gates.push({ a, b, op, output });
    }

    return { wires, gates, input_bit_count: initial.length / 2 };
}

function is_direct(gate: Gate) {
    return gate.a.startsWith("x") || gate.b.startsWith("x");
}

function is_output(gate: Gate) {
    return gate.output.startsWith("z");
}

function is_gate(type: string) {
    return function (gate: Gate) {
        return gate.op === type;
    };
}

function has_input(type: string) {
    return function (gate: Gate) {
        return gate.a === type || gate.b === type;
    };
}

function has_output(type: string) {
    return function (gate: Gate) {
        return gate.output === type;
    };
}

try {
    const result = await main();
    console.log(`The 8 wire anomalies are: ${result}`);
} catch (e) {
    console.error(e);
}

