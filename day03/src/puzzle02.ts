console.log("Day 03, Puzzle 02!")

import lineReader from "line-reader";

let enabled = 1;
let sum = 0;
lineReader.eachLine("./input/input.txt", (line, last) => {
    const regex =  /(do|don't|mul)\((\d{1,3},\d{1,3})?\)/g;
    let match;

    while ((match = regex.exec(line)) !== null) {
        const instruction = match[1];
        switch (instruction) {
            case "do":
                enabled = 1;
                break;
            case "don't":
                enabled = 0;
                break;
            case "mul":
                const [a, b] = match[2].split(",").map(raw => parseInt(raw));
                sum += a * b * enabled;
                break;
        }
    }

    if (last) {
        console.log(`Added up results of multiplications: ${sum}`)
    }
});
