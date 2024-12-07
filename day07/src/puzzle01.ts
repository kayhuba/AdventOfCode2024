console.log("Day 07, Puzzle 01!")

import lineReader from "line-reader";

interface Operator {
    evaluate: (a: number, b: number) => number;
}

const Add: Operator = {
    evaluate: (a: number, b: number) => a + b
}

const Mul: Operator = {
    evaluate: (a: number, b: number) => a * b
}

let totalCalibrationResult = 0;
const operators: Operator[] = [Add, Mul];
lineReader.eachLine("./input/input.txt", (line, last) => {
    const resultAndParameters = line.split(": ");
    if (resultAndParameters.length > 0) {
        const desiredResult = parseInt(resultAndParameters[0]);
        const parameters = resultAndParameters[1].split(" ").map((parameter) => parseInt(parameter));

        const operatorCount = parameters.length - 1;
        const combinations = Math.pow(operators.length, operatorCount);
        for (let i=0; i < combinations; i++) {
            const result = parameters.slice(1).reduce((acc, parameter, index) => {
                const operatorIndex = Math.floor(i / Math.pow(operators.length,operatorCount - index - 1)) % operators.length;
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
