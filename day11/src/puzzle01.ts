console.log("Day 11, Puzzle 01!")

import lineReader from "line-reader";

function applyRule(stone: number): number[] {
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
lineReader.eachLine("./input/input.txt", (line, last) => {
    if (line.length > 0) {
        let stones = line.split(" ").map((stone) => parseInt(stone));

        for (let i=0; i < 25; i++) {
           stones = stones.map((stone) => applyRule(stone)).flat();
        }

        console.log(`Number of stones: ${stones.length}`);
    }

    if (last) {
        console.timeEnd(timer);
    }
});
