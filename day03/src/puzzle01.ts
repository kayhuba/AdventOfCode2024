console.log("Day 03, Puzzle 01!")

import lineReader from "line-reader";

let sum = 0;
lineReader.eachLine("./input/input.txt", (line, last) => {
    const regex =  /mul\((\d{1,3},\d{1,3})\)/g;
    let match;

    while ((match = regex.exec(line)) !== null) {
        const [a, b] = match[1].split(",").map(raw => parseInt(raw));
        sum += a * b;
    }

    if (last) {
        console.log(`Added up results of multiplications: ${sum}`)
    }
});
