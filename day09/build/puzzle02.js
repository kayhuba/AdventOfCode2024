"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 09, Puzzle 02!");
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
        // diag
        // console.log(fileSystem.map((value) => value === -1 ? "." : value).join(""));
        // compaction process
        // 1. find all empty gaps and index them
        const gaps = [];
        let gapStartIndex = -1;
        for (let i = 0; i < fileSystem.length; i++) {
            if (fileSystem[i] === -1) {
                if (gapStartIndex === -1) {
                    gapStartIndex = i;
                }
                continue;
            }
            if (gapStartIndex > -1) {
                const gapSize = i - gapStartIndex;
                gaps.push({ size: gapSize, index: gapStartIndex });
                gapStartIndex = -1;
            }
        }
        // at this point, the gaps are "automatically" sorted by index ascending
        // 2. try to compact
        for (let i = fileSystem.length - 1; i > 0; i--) {
            if (fileSystem[i] !== -1) {
                const fileEnd = i;
                let fileStart = i;
                while (fileStart > 0 && fileSystem[fileStart - 1] === fileSystem[i]) {
                    fileStart--;
                }
                const fileSize = fileEnd - fileStart + 1;
                // find first gap that fits the file
                const gapIndex = gaps.findIndex((gap) => gap.size >= fileSize);
                if (gapIndex !== -1) {
                    // move file to gap
                    fileSystem.fill(fileSystem[i], gaps[gapIndex].index, gaps[gapIndex].index + fileSize);
                    if (gaps[gapIndex].size === fileSize) {
                        gaps.splice(gapIndex, 1);
                    }
                    else {
                        gaps[gapIndex].index += fileSize;
                        gaps[gapIndex].size -= fileSize;
                    }
                    // remove file from original position
                    fileSystem.fill(-1, fileStart, fileEnd + 1);
                }
                i = fileStart;
                // remove any gaps that start after i
                while (gaps.length > 0 && gaps[gaps.length - 1].index > i) {
                    gaps.pop();
                }
            }
        }
        // diag
        // console.log(fileSystem.map((value) => value === -1 ? "." : value).join(""));
        // console.log(gaps);
        // checksum
        let checksum = 0;
        for (let i = 0; i < fileSystem.length; i++) {
            if (fileSystem[i] === -1) {
                continue;
            }
            checksum += fileSystem[i] * i;
        }
        console.log(`Checksum: ${checksum}`);
    }
});
//# sourceMappingURL=puzzle02.js.map