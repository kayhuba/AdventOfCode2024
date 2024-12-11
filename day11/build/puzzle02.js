"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 11, Puzzle 02!");
const line_reader_1 = __importDefault(require("line-reader"));
function applyRule(stone) {
    if (stone === 0) {
        return [1];
    }
    if (`${stone}`.length % 2 === 0) {
        const stoneDigits = `${stone}`;
        return [parseInt(stoneDigits.substring(0, stoneDigits.length / 2)), parseInt(stoneDigits.substring(stoneDigits.length / 2))];
    }
    return [stone * 2024];
}
const timer = "Execution time";
console.time(timer);
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        let stones = line.split(" ").map((stone) => parseInt(stone));
        // meep, not working anymore
        for (let i = 0; i < 75; i++) {
            stones = stones.map((stone) => applyRule(stone)).flat();
        }
        console.log(`Number of stones: ${stones.length}`);
    }
    if (last) {
        console.timeEnd(timer);
    }
});
//# sourceMappingURL=puzzle02.js.map