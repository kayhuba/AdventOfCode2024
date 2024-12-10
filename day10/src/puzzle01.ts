console.log("Day 10, Puzzle 01!")

import lineReader from "line-reader";

interface Position {
    x: number;
    y: number;
}

enum Move {
    Up,
    Right,
    Down,
    Left
}

const map: number[][] = [];
const possibleMoves: Move[] = [Move.Up, Move.Right, Move.Down, Move.Left];

function discoverNext(map: number[][], position: Position, trail: Position[]): Position[][] {
    const newTrails: Position[][] = [];
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
lineReader.eachLine("./input/input.txt", (line, last) => {
    const row = line.split("").map(char => parseInt(char));
    map.push(row);

    if (last) {
        let trailHeads: Position[][] = [];
        map.forEach((row, y) => row.forEach((value, x) => {
            if (value === 0) {
                trailHeads.push([{ x, y }]);
            }
        }));

        const addedScore = trailHeads.map(trailHead => {
            let trails: Position[][] = [[...trailHead]];
            for (let step=0; step < 9 && trails.length > 0; step++) {
                trails = [...trails].map((trail, index) => [...discoverNext(map, trail[trail.length - 1], trail)]).flat();
            }

            // there's a mean extra: We need to filter out all trails that end at the same position and just keep one
            const endPositions: Set<string> = new Set();
            trails = trails.filter(trail => {
                const position = trail[trail.length - 1];
                const key = `${position.x},${position.y}`;
                if (endPositions.has(key)) {
                    return false;
                }
                endPositions.add(key);
                return true;
            });

            return trails.length;
        }).reduce((accumulatedScore, score) => accumulatedScore + score, 0);

        console.log(`Added score: ${addedScore}`);

        console.timeEnd(timer);
    }
});
