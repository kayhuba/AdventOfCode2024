"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 06, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
})(Direction || (Direction = {}));
function markWalkCheck(grid, guard, distinctCounter) {
    grid[guard.y][guard.x] = "X";
    switch (guard.direction) {
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
const grid = [];
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    const lineParts = line.split("");
    if (lineParts.length > 0) {
        grid.push(lineParts);
    }
    if (last) {
        // find guards starting position
        const guard = {
            x: 0,
            y: 0,
            direction: Direction.Up
        };
        grid.some((row, y) => row.some((cell, x) => {
            if (cell === "^") {
                guard.x = x;
                guard.y = y;
                return true;
            }
            return false;
        }));
        const distinctCounter = { count: 1 };
        while (markWalkCheck(grid, guard, distinctCounter)) { }
        ;
        console.log(`Distinct positions of the guard beore leaving the map: ${distinctCounter.count}`);
    }
});
//# sourceMappingURL=puzzle01.js.map