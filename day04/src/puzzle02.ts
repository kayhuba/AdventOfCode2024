console.log("Day 04, Puzzle 02!")

import lineReader from "line-reader";

function isMatchPart(square: string[][], character: string, x: number, y: number): boolean {
    if (x < 0 || x >= square[0].length || y < 0 || y >= square.length) {
        return false;
    }

    return square[y][x] === character;
}

function isMatch(square: string[][], subject: string, x: number, y: number, directionX: number, directionY: number): boolean {
    const subjectParts = subject.split("");
    return subjectParts.every((part, index) => {
        return isMatchPart(square, part, x + (index * directionX), y + (index * directionY));
    });
}

function checkCount(centerX: number, centerY: number, crossMatchCenters: Map<number, Set<number>>): number {
    if (!crossMatchCenters.has(centerY)) {
        const newSet: Set<number> = new Set();
        newSet.add(centerX);
        crossMatchCenters.set(centerY, newSet);

        return 1;
    }

    if (crossMatchCenters.has(centerY) && !crossMatchCenters.get(centerY)!.has(centerX)) {
        crossMatchCenters.get(centerY)!.add(centerX);

        return 1;
    }

    return 0;
}

const square: string[][] = [];
const crossMatchCenters: Map<number, Set<number>> = new Map();
lineReader.eachLine("./input/input.txt", (line, last) => {
    square.push(line.split(""));

    if (last) {
        const word = "MAS";
        let crossMasCount = 0;
        for (let y = 0; y < square.length; y++) {
            for (let x = 0; x < square[y].length; x++) {
                // diagonal down-right
                if (isMatch(square, word, x, y, 1, 1)) {
                    // diagonal down-left
                    if (isMatch(square, word, x + word.length - 1, y, -1, 1)) {
                        crossMasCount += checkCount(x + Math.floor(word.length / 2), y + Math.floor(word.length / 2), crossMatchCenters);
                    }
                    // diagonal up-right
                    if (isMatch(square, word, x, y + word.length - 1, 1, -1)) {
                        crossMasCount += checkCount(x + Math.floor(word.length / 2), y + Math.floor(word.length / 2), crossMatchCenters);
                    }
                }

                // diagonal up-left
                if (isMatch(square, word, x, y, -1, -1)) {
                    // diagonal down-left
                    if (isMatch(square, word, x, y - (word.length - 1), -1, 1)) {
                        crossMasCount += checkCount(x - Math.floor(word.length / 2), y - Math.floor(word.length / 2), crossMatchCenters);
                    }
                    // diagonal up-right
                    if (isMatch(square, word, x - (word.length - 1), y, 1, -1)) {
                        crossMasCount += checkCount(x - Math.floor(word.length / 2), y - Math.floor(word.length / 2), crossMatchCenters);
                    }
                }

                // diagonal down-left
                if (isMatch(square, word, x, y, -1, 1)) {
                    // diagonal down-right
                    if (isMatch(square, word, x - (word.length - 1), y, 1, 1)) {
                        crossMasCount += checkCount(x - Math.floor(word.length / 2), y + Math.floor(word.length / 2), crossMatchCenters);
                    }
                    // diagonal up-left
                    if (isMatch(square, word, x + (word.length - 1), y + (word.length - 1), -1, -1)) {
                        crossMasCount += checkCount(x - Math.floor(word.length / 2), y + Math.floor(word.length / 2), crossMatchCenters);
                    }
                }

                // diagonal up-right
                if (isMatch(square, word, x, y, 1, -1)) {
                    // diagonal down-right
                    if (isMatch(square, word, x, y - (word.length - 1), 1, 1)) {
                        crossMasCount += checkCount(x + Math.floor(word.length / 2), y - Math.floor(word.length / 2), crossMatchCenters);
                    }
                    // diagonal up-left
                    if (isMatch(square, word, x + word.length - 1, y, -1, -1)) {
                        crossMasCount += checkCount(x + Math.floor(word.length / 2), y - Math.floor(word.length / 2), crossMatchCenters);
                    }
                }
            }
        }

        console.log(`Count of cross-MAS entries: ${crossMasCount}`);
    }
});
