"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 05, Puzzle 02!");
const line_reader_1 = __importDefault(require("line-reader"));
const ruleBefore = new Map();
const ruleAfter = new Map();
const fixedUpdates = [];
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    const ruleMatches = /^(\d+)\|(\d+)$/.exec(line);
    if (ruleMatches !== null) {
        const first = parseInt(ruleMatches[1]);
        const second = parseInt(ruleMatches[2]);
        if (!ruleBefore.has(first)) {
            ruleBefore.set(first, new Set());
        }
        ruleBefore.get(first).add(second);
        if (!ruleAfter.has(second)) {
            ruleAfter.set(second, new Set());
        }
        ruleAfter.get(second).add(first);
    }
    const updateMatches = line.split(",");
    if (updateMatches.length > 1) {
        const update = updateMatches.map((value) => parseInt(value));
        const sortedUpdate = [...update];
        sortedUpdate.sort((a, b) => {
            if (ruleBefore.has(a) && ruleBefore.get(a).has(b)) {
                return -1;
            }
            else if (ruleAfter.has(a) && ruleAfter.get(a).has(b)) {
                return 1;
            }
            else {
                return 0;
            }
        });
        const isValidUpdate = update.every((value, index) => sortedUpdate[index] === value);
        if (isValidUpdate) {
            console.log(`Valid update: ${update}`);
        }
        else {
            console.log(`Invalid update: ${update}`);
            fixedUpdates.push(sortedUpdate);
        }
    }
    if (last) {
        const fixedUpdateMiddlepagesSum = fixedUpdates.reduce((sum, update) => sum + update[Math.floor(update.length / 2)], 0);
        console.log(`Sum of valid update middle pages: ${fixedUpdateMiddlepagesSum}`);
    }
});
//# sourceMappingURL=puzzle02.js.map