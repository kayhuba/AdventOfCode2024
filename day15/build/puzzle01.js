"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 15, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["RIGHT"] = 1] = "RIGHT";
    Direction[Direction["DOWN"] = 2] = "DOWN";
    Direction[Direction["LEFT"] = 3] = "LEFT";
})(Direction || (Direction = {}));
function isInWarehousePosition(position, maxX, maxY) {
    return position.x >= 0 && position.x < maxX && position.y >= 0 && position.y < maxY;
}
function push(position, direction, warehouse) {
    const startPosition = { ...position };
    const directionVector = { x: 0, y: 0 };
    switch (direction) {
        case Direction.UP:
            directionVector.y = -1;
            break;
        case Direction.RIGHT:
            directionVector.x = 1;
            break;
        case Direction.DOWN:
            directionVector.y = 1;
            break;
        case Direction.LEFT:
            directionVector.x = -1;
            break;
    }
    const nextPosition = {
        x: position.x + directionVector.x,
        y: position.y + directionVector.y
    };
    const nextRobotPosition = { ...nextPosition };
    const isPushing = isInWarehousePosition(nextPosition, warehouse[0].length, warehouse.length) && warehouse[nextPosition.y][nextPosition.x] === "O";
    while (isInWarehousePosition(nextPosition, warehouse[0].length, warehouse.length) &&
        warehouse[nextPosition.y][nextPosition.x] !== "." &&
        warehouse[nextPosition.y][nextPosition.x] !== "#") {
        nextPosition.x += directionVector.x;
        nextPosition.y += directionVector.y;
    }
    if (warehouse[nextPosition.y][nextPosition.x] === ".") {
        position.x = nextRobotPosition.x;
        position.y = nextRobotPosition.y;
        if (!isPushing) {
            return;
        }
        const nextEmptyPosition = {
            x: nextPosition.x,
            y: nextPosition.y
        };
        const distance = Math.abs(nextEmptyPosition.x - startPosition.x) + Math.abs(nextEmptyPosition.y - startPosition.y);
        const signY = Math.sign(nextEmptyPosition.y - startPosition.y);
        const signX = Math.sign(nextEmptyPosition.x - startPosition.x);
        for (let i = distance; i > 0; i--) {
            warehouse[startPosition.y + signY * i][startPosition.x + signX * i] =
                warehouse[startPosition.y + signY * (i - 1)][startPosition.x + signX * (i - 1)];
        }
    }
}
function printWarehouse(warehouse, robotPosition) {
    for (let y = 0; y < warehouse.length; y++) {
        console.log(warehouse[y].map((cell, x) => y === robotPosition.y && x === robotPosition.x ? "@" : cell).join(""));
    }
}
function totalGPS(warehouse) {
    return warehouse.map((row, y) => row
        .map((cell, x) => cell === "O" ? 1 : 0)
        .reduce((acc, value, x) => acc + value * (y * 100 + x), 0)).reduce((acc, value) => acc + value, 0);
}
const warehouse = [];
let robotMoves = [];
const timer = "Execution time";
console.time(timer);
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.startsWith("#")) {
        const warehouseLine = line.split("");
        warehouse.push(warehouseLine);
        return;
    }
    if (/^[<v>^]/.test(line)) {
        robotMoves = robotMoves.concat(line.split(""));
    }
    if (last) {
        const robotPosition = { x: 0, y: 0 };
        outer: for (let y = 0; y < warehouse.length; y++) {
            for (let x = 0; x < warehouse[y].length; x++) {
                if (warehouse[y][x] === "@") {
                    robotPosition.x = x;
                    robotPosition.y = y;
                    warehouse[y][x] = ".";
                    break outer;
                }
            }
        }
        let moveCount = 0;
        for (const move of robotMoves) {
            switch (move) {
                case "<":
                    push(robotPosition, Direction.LEFT, warehouse);
                    break;
                case ">":
                    push(robotPosition, Direction.RIGHT, warehouse);
                    break;
                case "^":
                    push(robotPosition, Direction.UP, warehouse);
                    break;
                case "v":
                    push(robotPosition, Direction.DOWN, warehouse);
                    break;
            }
            moveCount++;
            //            console.log(`After move ${moveCount}:`);
            //            printWarehouse(warehouse, robotPosition);
        }
        console.log(`After move ${moveCount}:`);
        printWarehouse(warehouse, robotPosition);
        console.log(`Total GPS: ${totalGPS(warehouse)}`);
        console.timeEnd(timer);
    }
});
//# sourceMappingURL=puzzle01.js.map