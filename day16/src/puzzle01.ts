console.log("Day 16, Puzzle 01!")

import lineReader from "line-reader";

interface Vector {
    x: number;
    y: number;
}

enum Action {
    TurnClockwise,
    TurnCounterClockwise,
    Move
}

enum Orientation {
    North,
    East,
    South,
    West
}

interface Node {
    position: Vector;
    gCostToArriveHere: number;
    hDistanceToEndPoint: number;
    orientation: Orientation;
    action: Action | null;
    previous: Node | null;
}

function printPath(maze: string[][], node: Node) {
    // TODO
}

function manhattanDistance(a: Vector, b: Vector): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function findLowestScoringPath(maze: string[][], startingPoint: Vector, endingPoint: Vector): number {
    const initialNode: Node = {
        position: startingPoint,
        gCostToArriveHere: 0,
        hDistanceToEndPoint: manhattanDistance(startingPoint, endingPoint),
        orientation: Orientation.East,
        action: null,
        previous: null
    };

    console.log(`Finding lowest scoring path from ${startingPoint.x},${startingPoint.y} to ${endingPoint.x},${endingPoint.y}`);

    const openList: Node[] = [initialNode];
    const openListCache: Map<string, Node> = new Map();
    const closedList: Map<string, Node> = new Map();
    do {
        let currentNode: Node = openList.pop() as Node;
        if (currentNode.position.x === endingPoint.x && currentNode.position.y === endingPoint.y) {
            printPath(maze, currentNode);
            return currentNode.gCostToArriveHere;
        }

        closedList.set(`${currentNode.position.y},${currentNode.position.x}${currentNode.orientation.valueOf()}`, currentNode);

        const successorNodes: Node[] = [
            // TurnClockwise
            {
                position: {...currentNode.position},
                gCostToArriveHere: currentNode.gCostToArriveHere + 1000,
                hDistanceToEndPoint: currentNode.hDistanceToEndPoint,
                orientation: (currentNode.orientation + 1) % 4,
                action: Action.TurnClockwise,
                previous: currentNode
            },
            // TurnCounterClockwise
            {
                position: {...currentNode.position},
                gCostToArriveHere: currentNode.gCostToArriveHere + 1000,
                hDistanceToEndPoint: currentNode.hDistanceToEndPoint,
                orientation: (currentNode.orientation + 3) % 4,
                action: Action.TurnCounterClockwise,
                previous: currentNode
            },
        ];

        let move: Vector;
        switch(currentNode.orientation) {
            case Orientation.North:
                move = { x: 0, y: -1 };
                break;
            case Orientation.East:
                move = { x: 1, y: 0 };
                break;
            case Orientation.South:
                move = { x: 0, y: 1 };
                break;
            case Orientation.West:
                move = { x: -1, y: 0 };
                break;
        }
        if (maze[currentNode.position.y + move.y][currentNode.position.x + move.x] === ".") {
            successorNodes.push({
                position: {x: currentNode.position.x + move.x, y: currentNode.position.y + move.y},
                gCostToArriveHere: currentNode.gCostToArriveHere + 1,
                hDistanceToEndPoint: manhattanDistance({
                    x: currentNode.position.x + move.x,
                    y: currentNode.position.y + move.y
                }, endingPoint),
                orientation: currentNode.orientation,
                action: Action.Move,
                previous: currentNode
            });
        }

        successorNodes
            .filter(node => !closedList.has(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`))
            .filter(node => openListCache.has(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`) ?
                openListCache.get(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`)!.gCostToArriveHere > node.gCostToArriveHere :
                true
            )
            .forEach(node => {
                if (openListCache.has(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`)) {
                    const existingNode = openListCache.get(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`)!;
                    existingNode.gCostToArriveHere = node.gCostToArriveHere;
                    existingNode.action = node.action;
                    existingNode.previous = node.previous;
                    return;
                }

                openListCache.set(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`, node);
                openList.unshift(node);
            });

        // sort by f = g + h
        openList.sort((a, b) =>  (b.gCostToArriveHere + b.hDistanceToEndPoint) - (a.gCostToArriveHere + a.hDistanceToEndPoint));
    } while (openList.length > 0);

    return -1;
}

const maze: string[][] = [];

const timer = "Execution time";
console.time(timer);
lineReader.eachLine("./input/input.txt", (line, last) => {
    if (line.startsWith("#")) {
        maze.push(line.split(""));
    }

    if (last) {
        const startingPoint: Vector = { x: 0, y: 0 };
        const endingPoint: Vector = { x: 0, y: 0 };

        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                if (maze[y][x] === "S") {
                    startingPoint.x = x;
                    startingPoint.y = y;
                    maze[y][x] = ".";
                } else if (maze[y][x] === "E") {
                    endingPoint.x = x;
                    endingPoint.y = y;
                    maze[y][x] = ".";
                }
            }
        }

        const score = findLowestScoringPath(maze, startingPoint, endingPoint);
        console.log(`The lowest scoring path has a score of ${score}`);

        console.timeEnd(timer);
    }
});
