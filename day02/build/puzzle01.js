"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 01, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
let safeReports = 0;
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    const levels = line.split(/\s+/);
    if (levels !== null) {
        const report = levels.map((level) => parseInt(level));
        let safe = true;
        let firstDirection = Math.sign(report[1] - report[0]);
        for (let i = 1; i < report.length; i++) {
            if (Math.sign(report[i] - report[i - 1]) !== firstDirection) {
                safe = false;
                break;
            }
            if (Math.abs(report[i] - report[i - 1]) < 1 || Math.abs(report[i] - report[i - 1]) > 3) {
                safe = false;
                break;
            }
        }
        if (safe) {
            safeReports++;
        }
    }
    if (last) {
        console.log(`Safe reports: ${safeReports}`);
    }
});
//# sourceMappingURL=puzzle01.js.map