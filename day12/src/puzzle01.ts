console.log("Day 01, Puzzle 01!")

import lineReader from "line-reader";

const timer = "Execution time";
console.time(timer);
lineReader.eachLine("./input/input.txt", (line, last) => {
    if (last) {
        console.timeEnd(timer);
    }
});
