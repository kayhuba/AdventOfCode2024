"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 01, Puzzle 02!");
const line_reader_1 = __importDefault(require("line-reader"));
const isSafe = (report) => {
    const directions = [];
    for (let i = 1; i < report.length; i++) {
        if (Math.abs(report[i] - report[i - 1]) < 1 || Math.abs(report[i] - report[i - 1]) > 3) {
            return false;
        }
        directions.push(report[i] - report[i - 1]);
    }
    const directionPlusCount = directions.reduce((count, direction) => direction >= 0 ? count + 1 : count, 0);
    return directionPlusCount === 0 || directionPlusCount === directions.length;
};
let safeReports = 0;
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    const levels = line.split(/\s+/);
    if (levels !== null) {
        const report = levels.map((level) => parseInt(level));
        if (isSafe(report)) {
            safeReports++;
        }
        else {
            for (let i = 0; i < report.length; i++) {
                const dampenedReport = report.toSpliced(i, 1);
                if (isSafe(dampenedReport)) {
                    safeReports++;
                    break;
                }
            }
        }
    }
    if (last) {
        console.log(`Safe reports: ${safeReports}`);
    }
});
//# sourceMappingURL=puzzle02.js.map