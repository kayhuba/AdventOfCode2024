"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 03, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
let sum = 0;
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    const regex = /mul\((\d{1,3},\d{1,3})\)/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
        const [a, b] = match[1].split(",").map(raw => parseInt(raw));
        sum += a * b;
    }
    if (last) {
        console.log(`Added up results of multiplications: ${sum}`);
    }
});
//# sourceMappingURL=puzzle01.js.map