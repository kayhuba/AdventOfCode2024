console.log("Day 01, Puzzle 02!")

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

        const occurrenceMap = new Map<number, number>();
        sortedListTwo.forEach(locationId => {
            const occurrence = occurrenceMap.get(locationId) || 0;
            occurrenceMap.set(locationId, occurrence + 1);
        });

        const totalSimilarityScore = sortedListOne.reduce((similarityScore, locationId) => similarityScore + (locationId * (occurrenceMap.get(locationId) || 0)), 0);
        console.log(`Similarity score: ${totalSimilarityScore}`);
    }
});
