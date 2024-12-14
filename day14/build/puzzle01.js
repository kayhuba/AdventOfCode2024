"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 14, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
function move(robot, seconds, maxX, maxY) {
    let newX = (robot.position.x + robot.direction.x * seconds) % maxX;
    let newY = (robot.position.y + robot.direction.y * seconds) % maxY;
    if (newX < 0) {
        newX = maxX + newX;
    }
    if (newY < 0) {
        newY = maxY + newY;
    }
    return {
        position: {
            x: newX,
            y: newY
        },
        direction: { ...robot.direction }
    };
}
const robots = [];
const timer = "Execution time";
console.time(timer);
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    const matches = /^p=(\d+),(\d+) v=(-?\d+),(-?\d+)$/.exec(line);
    if (matches) {
        const position = matches.slice(1, 3).map(Number);
        const velocity = matches.slice(3, 5).map(Number);
        robots.push({
            position: { x: position[0], y: position[1] },
            direction: { x: velocity[0], y: velocity[1] }
        });
    }
    if (last) {
        const spaceWidth = 101;
        const spaceHeight = 103;
        const seconds = 100;
        const grid = Array.from({ length: spaceHeight }, () => Array(spaceWidth).fill(0));
        const movedRobots = robots
            .map(robot => move(robot, seconds, spaceWidth, spaceHeight));
        const firstQuadrant = movedRobots
            .filter(robot => robot.position.x < Math.floor(spaceWidth / 2) && robot.position.y < Math.floor(spaceHeight / 2))
            .reduce((acc, robot) => acc + 1, 0);
        const secondQuadrant = movedRobots
            .filter(robot => robot.position.x > Math.floor(spaceWidth / 2) && robot.position.y < Math.floor(spaceHeight / 2))
            .reduce((acc, robot) => acc + 1, 0);
        const thirdQuadrant = movedRobots
            .filter(robot => robot.position.x < Math.floor(spaceWidth / 2) && robot.position.y > Math.floor(spaceHeight / 2))
            .reduce((acc, robot) => acc + 1, 0);
        const fourthQuadrant = movedRobots
            .filter(robot => robot.position.x > Math.floor(spaceWidth / 2) && robot.position.y > Math.floor(spaceHeight / 2))
            .reduce((acc, robot) => acc + 1, 0);
        // DIAG output
        // movedRobots.forEach(robot => grid[robot.position.y][robot.position.x]++);
        // grid.forEach(row => console.log(row.map(cell => cell > 0 ? cell : ".").join("")));
        console.log(`First quadrant: ${firstQuadrant}, second quadrant: ${secondQuadrant}, third quadrant: ${thirdQuadrant}, fourth quadrant: ${fourthQuadrant}`);
        console.log(`Safety factor: ${firstQuadrant * secondQuadrant * thirdQuadrant * fourthQuadrant}`);
        console.timeEnd(timer);
    }
});
//# sourceMappingURL=puzzle01.js.map