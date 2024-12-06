console.log("Day 06, Puzzle 01!")

import lineReader from "line-reader";

enum Direction {
    Up,
    Right,
    Down,
    Left
}

interface Guard {
    x: number;
    y: number;
    direction: Direction
}

interface DistinctCounter {
    count: number
}

function markWalkCheck(grid: string[][], guard: Guard, distinctCounter: DistinctCounter): boolean {
    grid[guard.y][guard.x] = "X";
    switch(guard.direction) {
        case Direction.Up:
            if (guard.y - 1 < 0) {
                return false;
            }

            if (grid[guard.y - 1][guard.x] === "#") {
                guard.direction = Direction.Right;
                return true;
            }

            guard.y--;
            break;
        case Direction.Right:
            if (guard.x + 1 === grid[0].length) {
                return false;
            }

            if (grid[guard.y][guard.x + 1] === "#") {
                guard.direction = Direction.Down;
                return true;
            }

            guard.x++;
            break;
        case Direction.Down:
            if (guard.y + 1 === grid.length) {
                return false;
            }

            if (grid[guard.y + 1][guard.x] === "#") {
                guard.direction = Direction.Left;
                return true;
            }

            guard.y++;
            break;
        case Direction.Left:
            if (guard.x - 1 < 0) {
                return false;
            }

            if (grid[guard.y][guard.x - 1] === "#") {
                guard.direction = Direction.Up;
                return true;
            }

            guard.x--;
            break;
    }

    if (grid[guard.y][guard.x] === ".") {
        distinctCounter.count++;
    }
    return true;
}

const grid: string[][] = [];
lineReader.eachLine("./input/input.txt", (line, last) => {
    const lineParts = line.split("");
    if (lineParts.length > 0) {
        grid.push(lineParts);
    }

    if (last) {
        // find guards starting position
        const guard: Guard = {
            x: 0,
            y: 0,
            direction: Direction.Up
        };
        grid.some((row, y) =>
            row.some((cell, x) => {
                if (cell === "^") {
                    guard.x = x;
                    guard.y = y;
                    return true;
                }

                return false;
            })
        );
        const distinctCounter: DistinctCounter = {count: 1};
        while (markWalkCheck(grid, guard, distinctCounter)) {};

        console.log(`Distinct positions of the guard beore leaving the map: ${distinctCounter.count}`);
    }
});
