"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 10, Puzzle 02!");
const line_reader_1 = __importDefault(require("line-reader"));
var Move;
(function (Move) {
    Move[Move["Up"] = 0] = "Up";
    Move[Move["Right"] = 1] = "Right";
    Move[Move["Down"] = 2] = "Down";
    Move[Move["Left"] = 3] = "Left";
})(Move || (Move = {}));
const map = [];
const possibleMoves = [Move.Up, Move.Right, Move.Down, Move.Left];
function discoverNext(map, position, trail) {
    const newTrails = [];
    possibleMoves.forEach(move => {
        const nextPosition = { ...position };
        switch (move) {
            case Move.Up:
                nextPosition.y--;
                break;
            case Move.Right:
                nextPosition.x++;
                break;
            case Move.Down:
                nextPosition.y++;
                break;
            case Move.Left:
                nextPosition.x--;
                break;
        }
        if (nextPosition.x >= 0 && nextPosition.x < map[0].length &&
            nextPosition.y >= 0 && nextPosition.y < map.length &&
            map[nextPosition.y][nextPosition.x] === map[position.y][position.x] + 1) {
            newTrails.push([...trail, nextPosition]);
        }
    });
    return newTrails;
}
const timer = "Execution time";
console.time(timer);
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    const row = line.split("").map(char => parseInt(char));
    map.push(row);
    if (last) {
        let trailHeads = [];
        map.forEach((row, y) => row.forEach((value, x) => {
            if (value === 0) {
                trailHeads.push([{ x, y }]);
            }
        }));
        const sumOfRatingsOfTrailheadScores = trailHeads.map(trailHead => {
            let trails = [[...trailHead]];
            for (let step = 0; step < 9 && trails.length > 0; step++) {
                trails = [...trails].map((trail, index) => [...discoverNext(map, trail[trail.length - 1], trail)]).flat();
            }
            return trails.length;
        }).reduce((accumulatedScore, score) => accumulatedScore + score, 0);
        console.log(`Sum of the ratings of all trailheads: ${sumOfRatingsOfTrailheadScores}`);
        console.timeEnd(timer);
    }
});
//# sourceMappingURL=puzzle02.js.map