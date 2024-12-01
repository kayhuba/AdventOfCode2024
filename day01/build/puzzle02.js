"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 01, Puzzle 02!");
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
        const occurrenceMap = new Map();
        sortedListTwo.forEach(locationId => {
            const occurrence = occurrenceMap.get(locationId) || 0;
            occurrenceMap.set(locationId, occurrence + 1);
        });
        const totalSimilarityScore = sortedListOne.reduce((similarityScore, locationId) => similarityScore + (locationId * (occurrenceMap.get(locationId) || 0)), 0);
        console.log(`Similarity score: ${totalSimilarityScore}`);
    }
});
//# sourceMappingURL=puzzle02.js.map