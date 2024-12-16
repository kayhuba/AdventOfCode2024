"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 16, Puzzle 02!");
const line_reader_1 = __importDefault(require("line-reader"));
var Action;
(function (Action) {
    Action[Action["TurnClockwise"] = 0] = "TurnClockwise";
    Action[Action["TurnCounterClockwise"] = 1] = "TurnCounterClockwise";
    Action[Action["Move"] = 2] = "Move";
})(Action || (Action = {}));
var Orientation;
(function (Orientation) {
    Orientation[Orientation["North"] = 0] = "North";
    Orientation[Orientation["East"] = 1] = "East";
    Orientation[Orientation["South"] = 2] = "South";
    Orientation[Orientation["West"] = 3] = "West";
})(Orientation || (Orientation = {}));
function printPath(maze, node) {
    // TODO
}
function manhattanDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
function iterateNode(allStepNodes, node) {
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
function findLowestScoringPath(maze, startingPoint, endingPoint) {
    const initialNode = {
        position: startingPoint,
        gCostToArriveHere: 0,
        hDistanceToEndPoint: manhattanDistance(startingPoint, endingPoint),
        orientation: Orientation.East,
        nodeStep: 0,
        action: null,
        previous: null
    };
    console.log(`Finding lowest scoring path from ${startingPoint.x},${startingPoint.y} to ${endingPoint.x},${endingPoint.y}`);
    let accumulatedSteps = 0;
    let foundCostToArrive = -1;
    const openList = [initialNode];
    const openListCache = new Map();
    const closedList = new Map();
    do {
        let currentNode = openList.pop();
        closedList.set(`${currentNode.position.y},${currentNode.position.x}${currentNode.orientation.valueOf()}`, currentNode);
        if (currentNode.position.x === endingPoint.x && currentNode.position.y === endingPoint.y) {
            if (foundCostToArrive === -1 || currentNode.gCostToArriveHere === foundCostToArrive) {
                printPath(maze, currentNode);
                foundCostToArrive = currentNode.gCostToArriveHere;
                const allStepNodes = new Set();
                iterateNode(allStepNodes, currentNode);
                accumulatedSteps += allStepNodes.size + 1; // +1 because start counts as well
                continue;
            }
        }
        const successorNodes = [
            // TurnClockwise
            {
                position: { ...currentNode.position },
                gCostToArriveHere: currentNode.gCostToArriveHere + 1000,
                hDistanceToEndPoint: currentNode.hDistanceToEndPoint,
                orientation: (currentNode.orientation + 1) % 4,
                nodeStep: 0,
                action: Action.TurnClockwise,
                previous: [currentNode]
            },
            // TurnCounterClockwise
            {
                position: { ...currentNode.position },
                gCostToArriveHere: currentNode.gCostToArriveHere + 1000,
                hDistanceToEndPoint: currentNode.hDistanceToEndPoint,
                orientation: (currentNode.orientation + 3) % 4,
                nodeStep: 0,
                action: Action.TurnCounterClockwise,
                previous: [currentNode]
            },
        ];
        let move;
        switch (currentNode.orientation) {
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
                position: { x: currentNode.position.x + move.x, y: currentNode.position.y + move.y },
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
            openListCache.get(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`).gCostToArriveHere >= node.gCostToArriveHere :
            true)
            .forEach(node => {
            if (openListCache.has(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`)) {
                const existingNode = openListCache.get(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`);
                if (existingNode.gCostToArriveHere > node.gCostToArriveHere) {
                    existingNode.gCostToArriveHere = node.gCostToArriveHere;
                    existingNode.action = node.action;
                    existingNode.previous = node.previous;
                    return;
                }
                // at this point, the existing node must have equal cost (lower is filtered above), so we _add_ it to the other possible ways to get here
                existingNode.previous = [...existingNode.previous, ...node.previous];
                return;
            }
            openListCache.set(`${node.position.y},${node.position.x}${node.orientation.valueOf()}`, node);
            openList.unshift(node);
        });
        // sort by f = g + h
        openList.sort((a, b) => (b.gCostToArriveHere + b.hDistanceToEndPoint) - (a.gCostToArriveHere + a.hDistanceToEndPoint));
    } while (openList.length > 0);
    return accumulatedSteps;
}
const maze = [];
const timer = "Execution time";
console.time(timer);
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    if (line.startsWith("#")) {
        maze.push(line.split(""));
    }
    if (last) {
        const startingPoint = { x: 0, y: 0 };
        const endingPoint = { x: 0, y: 0 };
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                if (maze[y][x] === "S") {
                    startingPoint.x = x;
                    startingPoint.y = y;
                    maze[y][x] = ".";
                }
                else if (maze[y][x] === "E") {
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
//# sourceMappingURL=puzzle02.js.map