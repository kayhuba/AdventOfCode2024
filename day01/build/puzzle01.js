"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 01, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
const listOne = [];
const listTwo = [];
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    const matches = /^(\d+)\s+(\d+)$/.exec(line);
    if (matches !== null) {
        listOne.push(parseInt(matches[1]));
        listTwo.push(parseInt(matches[2]));
    }
    if (last) {
        const sortedListOne = listOne.sort();
        const sortedListTwo = listTwo.sort();
        const distances = listOne.map((locationId, index) => Math.abs(sortedListTwo[index] - locationId));
        const summedDistances = distances.reduce((sum, locationId) => sum + locationId, 0);
        console.log(`Summed distances: ${summedDistances}`);
    }
});
//# sourceMappingURL=puzzle01.js.map