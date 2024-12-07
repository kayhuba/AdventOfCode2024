"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 07, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
const Add = {
    evaluate: (a, b) => a + b
};
const Mul = {
    evaluate: (a, b) => a * b
};
let totalCalibrationResult = 0;
const operators = [Add, Mul];
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    const resultAndParameters = line.split(": ");
    if (resultAndParameters.length > 0) {
        const desiredResult = parseInt(resultAndParameters[0]);
        const parameters = resultAndParameters[1].split(" ").map((parameter) => parseInt(parameter));
        const operatorCount = parameters.length - 1;
        const combinations = Math.pow(operators.length, operatorCount);
        for (let i = 0; i < combinations; i++) {
            // console.log(`Combination ${i}`);
            const result = parameters.slice(1).reduce((acc, parameter, index) => {
                const operatorIndex = Math.floor(i / Math.pow(operators.length, operatorCount - index - 1)) % operators.length;
                // console.log(`operatorIndex ${operatorIndex}`);
                return operators[operatorIndex].evaluate(acc, parameter);
            }, parameters[0]);
            // TODO if we order the operators in a clever way, we can abort as soon as the result is bigger than desiredResult
            if (result === desiredResult) {
                totalCalibrationResult += desiredResult;
                break;
            }
        }
    }
    if (last) {
        console.log(`Total calibration result: ${totalCalibrationResult}`);
    }
});
//# sourceMappingURL=puzzle01.js.map