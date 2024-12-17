console.log("Day 17, Puzzle 01!")

import lineReader from "line-reader";

enum OpCode {
    adv,
    bxl,
    bst,
    jnz,
    bxc,
    out,
    bdv,
    cdv
}

interface RawInstruction {
    opCode: OpCode;
    operand: number;
}

interface Registers {
    registerA: bigint;
    registerB: bigint;
    registerC: bigint;
}

interface Output {
    value: bigint | null;
}

interface Instruction {
    // returns the new instruction pointer value (in case operation jumps) or undefined
    execute: (operand: number, registers: Registers, output: Output) => number | undefined;
}

function resolveCombo(comboOperand: number, registers: Registers): bigint {
    if (comboOperand <= 3) {
        return BigInt(comboOperand);
    }

    if (comboOperand === 4) {
        return registers.registerA;
    }

    if (comboOperand === 5) {
        return registers.registerB;
    }

    if (comboOperand === 6) {
        return registers.registerC;
    }

    if (comboOperand === 7) {
        console.error("The text says, there is no comboOperand 7, but there is!");
        throw new Error("The text says, there is no comboOperand 7, but there is!");
    }

    throw new Error("Is it a 3 bit program or not!?");
}

class ADVInstruction implements Instruction {
    execute(operand: number, registers: Registers): number | undefined {
        const numerator = registers.registerA;
        registers.registerA = (numerator / (1n << resolveCombo(operand, registers)));
        return undefined;
    }
}

class BXLInstruction implements Instruction {
    execute(operand: number, registers: Registers): number | undefined {
        registers.registerB = registers.registerB ^ BigInt(operand);
        return undefined;
    }
}

class BSTInstruction implements Instruction {
    execute(operand: number, registers: Registers): number | undefined {
        registers.registerB = resolveCombo(operand, registers) % 8n;
        return undefined;
    }
}

class JNZInstruction implements Instruction {
    execute(operand: number, registers: Registers): number | undefined {
        if (registers.registerA === 0n) {
            return undefined;
        }

        return operand;
    }
}

class BXCInstruction implements Instruction {
    execute(operand: number, registers: Registers): number | undefined {
        registers.registerB = registers.registerB ^ registers.registerC;
        return undefined;
    }
}

class OUTInstruction implements Instruction {
    execute(operand: number, registers: Registers, output: Output): number | undefined {
        output.value = resolveCombo(operand, registers) % 8n;
        return undefined;
    }
}

class BDVInstruction implements Instruction {
    execute(operand: number, registers: Registers): number | undefined {
        const numerator = registers.registerA;
        registers.registerB = (numerator / (1n << resolveCombo(operand, registers)));
        return undefined;
    }
}

class CDVInstruction implements Instruction {
    execute(operand: number, registers: Registers): number | undefined {
        const numerator = registers.registerA;
        registers.registerC = (numerator / (1n << resolveCombo(operand, registers)));
        return undefined;
    }
}

const cpuInstructions: Instruction[] = [
    new ADVInstruction(),
    new BXLInstruction(),
    new BSTInstruction(),
    new JNZInstruction(),
    new BXCInstruction(),
    new OUTInstruction(),
    new BDVInstruction(),
    new CDVInstruction()
];

const registers: Registers = {
    registerA: 0n,
    registerB: 0n,
    registerC: 0n
}

let program: number[] = [];

const timer = "Execution time";
console.time(timer);
lineReader.eachLine("./input/input.txt", (line, last) => {
    const registerAMatch = /^Register A: (\d+)$/.exec(line);
    const registerBMatch = /^Register B: (\d+)$/.exec(line);
    const registerCMatch = /^Register C: (\d+)$/.exec(line);
    const programMatch = /^Program: (.+)$/.exec(line);

    if (registerAMatch !== null) {
        registers.registerA = BigInt(parseInt(registerAMatch[1]));
    }

    if (registerBMatch !== null) {
        registers.registerB = BigInt(parseInt(registerBMatch[1]));
    }

    if (registerCMatch !== null) {
        registers.registerC = BigInt(parseInt(registerCMatch[1]));
    }

    if (programMatch !== null) {
        program = programMatch[1].split(",").map((instruction) => parseInt(instruction));
    }

    if (last) {
        let output: string = "";
        let instructionPointer = 0;
        while (instructionPointer < program.length) {
            const instruction = program[instructionPointer];
            const operand = program[instructionPointer + 1];
            const opOutput: Output = {
                value: null
            }
            const jumpResult = cpuInstructions[instruction].execute(operand, registers, opOutput);
            if (opOutput.value !== null) {
                output += "" + opOutput.value + ",";
            }

            if (jumpResult !== undefined) {
                instructionPointer = jumpResult;
            } else {
                instructionPointer += 2;
            }
        }

        output = output.substring(0, output.length - 1);
        console.log(`Program output is: ${output}`);

        console.timeEnd(timer);
    }
});
