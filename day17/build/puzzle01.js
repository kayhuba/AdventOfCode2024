"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 17, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
var OpCode;
(function (OpCode) {
    OpCode[OpCode["adv"] = 0] = "adv";
    OpCode[OpCode["bxl"] = 1] = "bxl";
    OpCode[OpCode["bst"] = 2] = "bst";
    OpCode[OpCode["jnz"] = 3] = "jnz";
    OpCode[OpCode["bxc"] = 4] = "bxc";
    OpCode[OpCode["out"] = 5] = "out";
    OpCode[OpCode["bdv"] = 6] = "bdv";
    OpCode[OpCode["cdv"] = 7] = "cdv";
})(OpCode || (OpCode = {}));
function resolveCombo(comboOperand, registers) {
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
class ADVInstruction {
    execute(operand, registers) {
        const numerator = registers.registerA;
        registers.registerA = (numerator / (1n << resolveCombo(operand, registers)));
        return undefined;
    }
}
class BXLInstruction {
    execute(operand, registers) {
        registers.registerB = registers.registerB ^ BigInt(operand);
        return undefined;
    }
}
class BSTInstruction {
    execute(operand, registers) {
        registers.registerB = resolveCombo(operand, registers) % 8n;
        return undefined;
    }
}
class JNZInstruction {
    execute(operand, registers) {
        if (registers.registerA === 0n) {
            return undefined;
        }
        return operand;
    }
}
class BXCInstruction {
    execute(operand, registers) {
        registers.registerB = registers.registerB ^ registers.registerC;
        return undefined;
    }
}
class OUTInstruction {
    execute(operand, registers, output) {
        output.value = resolveCombo(operand, registers) % 8n;
        return undefined;
    }
}
class BDVInstruction {
    execute(operand, registers) {
        const numerator = registers.registerA;
        registers.registerB = (numerator / (1n << resolveCombo(operand, registers)));
        return undefined;
    }
}
class CDVInstruction {
    execute(operand, registers) {
        const numerator = registers.registerA;
        registers.registerC = (numerator / (1n << resolveCombo(operand, registers)));
        return undefined;
    }
}
const cpuInstructions = [
    new ADVInstruction(),
    new BXLInstruction(),
    new BSTInstruction(),
    new JNZInstruction(),
    new BXCInstruction(),
    new OUTInstruction(),
    new BDVInstruction(),
    new CDVInstruction()
];
const registers = {
    registerA: 0n,
    registerB: 0n,
    registerC: 0n
};
let program = [];
const timer = "Execution time";
console.time(timer);
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
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
        let output = "";
        let instructionPointer = 0;
        while (instructionPointer < program.length) {
            const instruction = program[instructionPointer];
            const operand = program[instructionPointer + 1];
            const opOutput = {
                value: null
            };
            const jumpResult = cpuInstructions[instruction].execute(operand, registers, opOutput);
            if (opOutput.value !== null) {
                output += "" + opOutput.value + ",";
            }
            if (jumpResult !== undefined) {
                instructionPointer = jumpResult;
            }
            else {
                instructionPointer += 2;
            }
        }
        output = output.substring(0, output.length - 1);
        console.log(`Program output is: ${output}`);
        console.timeEnd(timer);
    }
});
//# sourceMappingURL=puzzle01.js.map