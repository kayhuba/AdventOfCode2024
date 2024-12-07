"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 06, Puzzle 02!");
const line_reader_1 = __importDefault(require("line-reader"));
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
})(Direction || (Direction = {}));
function detectAndCountLoopingWithSimulatedBlock(grid, guard, guardPasses, loopTracker, blockPosition) {
    if (grid[blockPosition.y][blockPosition.x] === "^") {
        return;
    }
    const newGrid = grid.map(row => [...row]);
    const newGuardPasses = guardPasses.map(row => row.map(cell => [...cell]));
    newGrid[blockPosition.y][blockPosition.x] = "O";
    const newGuard = {
        x: guard.x,
        y: guard.y,
        direction: guard.direction
    };
    newGrid[guard.y][guard.x] = ".";
    newGuardPasses[guard.y][guard.x][guard.direction] = Math.max(0, newGuardPasses[guard.y][guard.x][guard.direction] - 1);
    while (markWalkCheck(newGrid, newGuard, newGuardPasses, loopTracker, false, blockPosition)) { }
}
function doMarkMove(grid, guard, guardPasses, loopTracker, currentBlockPosition) {
    let gridCell = "";
    if (guard.direction === Direction.Up || guard.direction === Direction.Down) {
        gridCell = "|";
        if (grid[guard.y][guard.x] === "-") {
            gridCell = "+";
        }
    }
    else if (guard.direction === Direction.Left || guard.direction === Direction.Right) {
        gridCell = "-";
        if (grid[guard.y][guard.x] === "|") {
            gridCell = "+";
        }
    }
    if (grid[guard.y][guard.x] === "^") {
        gridCell = "^";
    }
    grid[guard.y][guard.x] = gridCell;
    guardPasses[guard.y][guard.x][guard.direction]++;
    if (guardPasses[guard.y][guard.x][guard.direction] > 3) {
        if (currentBlockPosition !== undefined) {
            loopTracker.add(`${currentBlockPosition.x},${currentBlockPosition.y}`);
        }
        return false;
    }
    return true;
}
function markWalkCheck(grid, guard, guardPasses, loopTracker, addAdditionalBlocker, currentBlockPosition) {
    let guardXDelta = 0;
    let guardYDelta = 0;
    switch (guard.direction) {
        case Direction.Up:
            if (guard.y - 1 < 0) {
                return false;
            }
            if (grid[guard.y - 1][guard.x] === "#" || grid[guard.y - 1][guard.x] === "O") {
                guard.direction = Direction.Right;
                return true;
            }
            guardYDelta = -1;
            break;
        case Direction.Right:
            if (guard.x + 1 === grid[0].length) {
                return false;
            }
            if (grid[guard.y][guard.x + 1] === "#" || grid[guard.y][guard.x + 1] === "O") {
                guard.direction = Direction.Down;
                return true;
            }
            guardXDelta = 1;
            break;
        case Direction.Down:
            if (guard.y + 1 === grid.length) {
                return false;
            }
            if (grid[guard.y + 1][guard.x] === "#" || grid[guard.y + 1][guard.x] === "O") {
                guard.direction = Direction.Left;
                return true;
            }
            guardYDelta = 1;
            break;
        case Direction.Left:
            if (guard.x - 1 < 0) {
                return false;
            }
            if (grid[guard.y][guard.x - 1] === "#" || grid[guard.y][guard.x - 1] === "O") {
                guard.direction = Direction.Up;
                return true;
            }
            guardXDelta = -1;
            break;
    }
    if (!doMarkMove(grid, guard, guardPasses, loopTracker, currentBlockPosition)) {
        return false;
    }
    if (addAdditionalBlocker) {
        const blockPosition = { x: guard.x + guardXDelta, y: guard.y + guardYDelta };
        if (grid[blockPosition.y][blockPosition.x] === ".") {
            detectAndCountLoopingWithSimulatedBlock(grid, guard, guardPasses, loopTracker, blockPosition);
        }
    }
    guard.x += guardXDelta;
    guard.y += guardYDelta;
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
        const emptyGuardPasses = grid.map(row => row.map(cell => [0, 0, 0, 0]));
        const loopTracker = new Set();
        while (markWalkCheck(grid, guard, emptyGuardPasses, loopTracker, true, undefined)) { }
        ;
        console.log(`Number of loops: ${loopTracker.size}`);
    }
});
//# sourceMappingURL=puzzle02.js.map