"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 09, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        const blocks = line.split("").map((char) => parseInt(char));
        const arraySize = blocks.reduce((acc, value) => acc + value, 0);
        const fileSystem = new Array(arraySize).fill(0);
        // initial fill of file system
        let offset = 0;
        blocks.forEach((value, index) => {
            if (index % 2 === 1) {
                index = -1;
            }
            else {
                index = index / 2;
            }
            fileSystem.fill(index, offset, offset + value);
            offset += value;
        });
        // compaction process
        let firstEmpty = fileSystem.indexOf(-1);
        for (let i = fileSystem.length - 1; i >= 0 && firstEmpty < i; i--) {
            if (fileSystem[i] !== -1) {
                fileSystem[firstEmpty] = fileSystem[i];
                fileSystem[i] = -1;
                firstEmpty = fileSystem.indexOf(-1, firstEmpty);
            }
        }
        // diag
        // console.log(fileSystem.map((value) => value === -1 ? "." : value).join(""));
        // checksum
        let checksum = 0;
        for (let i = 0; i < fileSystem.length && fileSystem[i] > -1; i++) {
            checksum += fileSystem[i] * i;
        }
        console.log(`Checksum: ${checksum}`);
    }
});
//# sourceMappingURL=puzzle01.js.map