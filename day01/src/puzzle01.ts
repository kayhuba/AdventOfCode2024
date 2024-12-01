console.log("Day 01, Puzzle 01!")

import lineReader from "line-reader";

const listOne: number[] = [];
const listTwo: number[] = [];
lineReader.eachLine("./input/input.txt", (line, last) => {
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
