console.log("Day 04, Puzzle 01!")

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

const square: string[][] = [];
lineReader.eachLine("./input/input.txt", (line, last) => {
    square.push(line.split(""));

    if (last) {
        let xmasCount = 0;
        for (let y = 0; y < square.length; y++) {
            for (let x = 0; x < square[y].length; x++) {
                // right
                if (isMatch(square, "XMAS", x, y, 1, 0)) {
                    xmasCount++;
                }
                // left
                if (isMatch(square, "XMAS", x, y, -1, 0)) {
                    xmasCount++;
                }
                // down
                if (isMatch(square, "XMAS", x, y, 0, 1)) {
                    xmasCount++;
                }
                // up
                if (isMatch(square, "XMAS", x, y, 0, -1)) {
                    xmasCount++;
                }
                // diagonal down-right
                if (isMatch(square, "XMAS", x, y, 1, 1)) {
                    xmasCount++;
                }
                // diagonal up-left
                if (isMatch(square, "XMAS", x, y, -1, -1)) {
                    xmasCount++;
                }
                // diagonal down-left
                if (isMatch(square, "XMAS", x, y, -1, 1)) {
                    xmasCount++;
                }
                // diagonal up-right
                if (isMatch(square, "XMAS", x, y, 1, -1)) {
                    xmasCount++;
                }
            }
        }

        console.log(`Count of xmas entries: ${xmasCount}`);
    }
});
