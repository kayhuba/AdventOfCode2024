"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 01, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
const timer = "Execution time";
console.time(timer);
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (last) {
        console.timeEnd(timer);
    }
});
//# sourceMappingURL=puzzle01.js.map