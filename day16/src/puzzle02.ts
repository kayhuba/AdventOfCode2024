console.log("Day 16, Puzzle 02!")

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
    nodeStep: number;
    action: Action | null;
    previous: Node[] | null;
}

function printPath(maze: string[][], node: Node) {
    // TODO
}

function manhattanDistance(a: Vector, b: Vector): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function iterateNode(allStepNodes: Set<string>, node: Node) {
    if (allStepNodes.has(`${node.position.y},${node.position.x}`)) {
        return;
    }

    if (node.nodeStep > 0) {
        allStepNodes.add(`${node.position.y},${node.position.x}`);
    }

    if (node.previous !== null) {
        node.previous.forEach(previousNode => iterateNode(allStepNodes, previousNode));
    }
}

function findLowestScoringPath(maze: string[][], startingPoint: Vector, endingPoint: Vector): number {
    const initialNode: Node = {
        position: startingPoint,
        gCostToArriveHere: 0,
        hDistanceToEndPoint: manhattanDistance(startingPoint, endingPoint),
        orientation: Orientation.East,
        nodeStep: 0,
        action: null,
        previous: null
    };

    console.log(`Finding lowest scoring path from ${startingPoint.x},${startingPoint.y} to ${endingPoint.x},${endingPoint.y}`);

    let accumulatedSteps: number = 0;
    let foundCostToArrive: number = -1;
    const openList: Node[] = [initialNode];
    const openListCache: Map<string, Node> = new Map();
    const closedList: Map<string, Node> = new Map();
    do {
        let currentNode: Node = openList.pop() as Node;
        closedList.set(`${currentNode.position.y},${currentNode.position.x}${currentNode.orientation.valueOf()}`, currentNode);

        if (currentNode.position.x === endingPoint.x && currentNode.position.y === endingPoint.y) {
            if (foundCostToArrive === -1 || currentNode.gCostToArriveHere === foundCostToArrive) {
                printPath(maze, currentNode);
                foundCostToArrive = currentNode.gCostToArriveHere;

                const allStepNodes: Set<string> = new Set();
                iterateNode(allStepNodes, currentNode);

                accumulatedSteps += allStepNodes.size + 1; // +1 because start counts as well
                continue;
            }
        }

        const successorNodes: Node[] = [
            // TurnClockwise
            {
                position: {...currentNode.position},
                gCostToArriveHere: currentNode.gCostToArriveHere + 1000,
                hDistanceToEndPoint: currentNode.hDistanceToEndPoint,
                orientation: (currentNode.orientation + 1) % 4,
                nodeStep: 0,
                action: Action.TurnClockwise,
                previous: [currentNode]
            },
            // TurnCounterClockwise
            {
                position: {...currentNode.position},
                gCostToArriveHere: currentNode.gCostToArriveHere + 1000,
                hDistanceToEndPoint: currentNode.hDistanceToEndPoint,
                orientation: (currentNode.orientation + 3) % 4,
                nodeStep: 0,
                action: Action.TurnCounterClockwise,
                previous: [currentNode]
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
                nodeStep: 1,
                action: Action.Move,
                previous: [currentNode]
            });
        }

        successorNodes
            // .filter(node => !closedList.has(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`))
            .filter(node => openListCache.has(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`) ?
                openListCache.get(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`)!.gCostToArriveHere >= node.gCostToArriveHere :
                true
            )
            .forEach(node => {
                if (openListCache.has(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`)) {
                    const existingNode = openListCache.get(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`)!;
                    if (existingNode.gCostToArriveHere > node.gCostToArriveHere) {
                        existingNode.gCostToArriveHere = node.gCostToArriveHere;
                        existingNode.action = node.action;
                        existingNode.previous = node.previous;
                        return;
                    }

                    // at this point, the existing node must have equal cost (lower is filtered above), so we _add_ it to the other possible ways to get here
                    existingNode.previous = [...existingNode.previous as Node[], ...node.previous as Node[]];
                    return;
                }

                openListCache.set(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`, node);
                openList.unshift(node);
            });

        // sort by f = g + h
        openList.sort((a, b) =>  (b.gCostToArriveHere + b.hDistanceToEndPoint) - (a.gCostToArriveHere + a.hDistanceToEndPoint));
    } while (openList.length > 0);

    return accumulatedSteps;
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

        const pathSteps = findLowestScoringPath(maze, startingPoint, endingPoint);
        console.log(`Possible seat count: ${pathSteps}`);

        console.timeEnd(timer);
    }
});
