console.log("Day 01, Puzzle 01!")

import lineReader from "line-reader";

interface Button {
    xOffset: number;
    yOffset: number;
}

interface Machine {
    buttonA: Button;
    buttonB: Button;
    prize: {x: number, y: number};
}

enum Action {
    ButtonA,
    ButtonB
}

interface Node {
    x: number;
    y: number;
    gCostToArriveHere: number;
    hDistanceToPrize: number;
    action: Action | null,
    steps: number;
    previous: Node | null;
}

function printPath(node: Node) {
    let currentNodeForTrace: Node | null = node;
    const path: Node[] = [];
    do {
        path.push(currentNodeForTrace as Node);
        currentNodeForTrace = currentNodeForTrace.previous;
    } while (currentNodeForTrace !== null);

    const [buttonAPressed, buttonBPressed] = path.reduce((acc, node) => [acc[0] + (node.action === Action.ButtonA ? 1 : 0), acc[1] + (node.action === Action.ButtonB ? 1 : 0)], [0, 0]);
    console.log(`Found path to prize: ${path.length} steps, ${buttonAPressed} button A presses, ${buttonBPressed} button B presses resulted in prize at ${node.x},${node.y}`);
}

function manhattanDistance(a: {x: number, y: number}, b: {x: number, y: number}): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function findFewestTokens(machine: Machine): number {
    // we do A* with heuristic (h) of Manhattan distance to prize and edge cost of 3 for button A and 1 for button B
    const initialNode: Node = {
        x: 0,
        y: 0,
        gCostToArriveHere: 0,
        hDistanceToPrize: manhattanDistance({x: 0, y: 0}, {x: machine.prize.x, y: machine.prize.y}),
        action: null,
        steps: 0,
        previous: null
    };

    console.log(`Finding fewest tokens for machine with prize at ${machine.prize.x},${machine.prize.y}`);

    const openList: Node[] = [initialNode];
    const openListCache: Map<string, Node> = new Map();
    const closedList: Map<string, Node> = new Map();
    do {
        let currentNode: Node = openList.pop() as Node;
        if (currentNode.x === machine.prize.x && currentNode.y === machine.prize.y) {
            printPath(currentNode);
            return currentNode.gCostToArriveHere;
        }

        closedList.set(`${currentNode.y},${currentNode.x}`, currentNode);
        if (currentNode.x > machine.prize.x || currentNode.y > machine.prize.y) {
            // printPath(currentNode);
            continue;
        }

        const successorNodes: Node[] = [{
            x: currentNode.x + machine.buttonA.xOffset,
            y: currentNode.y + machine.buttonA.yOffset,
            gCostToArriveHere: currentNode.gCostToArriveHere + 3,
            hDistanceToPrize: manhattanDistance({x: currentNode.x + machine.buttonA.xOffset, y: currentNode.y + machine.buttonA.yOffset}, {x: machine.prize.x, y: machine.prize.y}),
            action: Action.ButtonA,
            steps: currentNode.steps + 1,
            previous: currentNode
        }, {
            x: currentNode.x + machine.buttonB.xOffset,
            y: currentNode.y + machine.buttonB.yOffset,
            gCostToArriveHere: currentNode.gCostToArriveHere + 1,
            hDistanceToPrize: manhattanDistance({x: currentNode.x + machine.buttonB.xOffset, y: currentNode.y + machine.buttonB.yOffset}, {x: machine.prize.x, y: machine.prize.y}),
            action: Action.ButtonB,
            steps: currentNode.steps + 1,
            previous: currentNode
        }];

        successorNodes
            .filter(node => !closedList.has(`${node.y},${node.x}`))
            .filter(node => openListCache.has(`${node.y},${node.x}`) ? openListCache.get(`${node.y},${node.x}`)!.gCostToArriveHere > node.gCostToArriveHere : true)
            .forEach(node => {
                if (openListCache.has(`${node.y},${node.x}`)) {
                    const existingNode = openListCache.get(`${node.y},${node.x}`)!;
                    existingNode.gCostToArriveHere = node.gCostToArriveHere;
                    existingNode.action = node.action;
                    existingNode.steps = node.steps;
                    return;
                }

                openListCache.set(`${node.y},${node.x}`, node);
                openList.unshift(node);
            });


        // sort by f = g + h
        // openList.sort((a, b) =>  (b.gCostToArriveHere + b.hDistanceToPrize) - (a.gCostToArriveHere + a.hDistanceToPrize));
    } while (openList.length > 0);

    console.log(`No path found to prize at ${machine.prize.x},${machine.prize.y}`);
    return 0;
}

const machines: Machine[] = [];
let currentButtonA: Button;
let currentButtonB: Button;

const timer = "Execution time";
console.time(timer);
lineReader.eachLine("./input/input.txt", (line, last) => {
    const buttonAMatch = /^Button A: X\+(\d+), Y\+(\d+)$/.exec(line);
    const buttonBMatch = /^Button B: X\+(\d+), Y\+(\d+)$/.exec(line);
    const prizeMatch = /^Prize: X=(\d+), Y=(\d+)$/.exec(line);

    if (buttonAMatch != null) {
        currentButtonA = {
            xOffset: parseInt(buttonAMatch[1]),
            yOffset: parseInt(buttonAMatch[2])
        };
    }

    if (buttonBMatch != null) {
        currentButtonB = {
            xOffset: parseInt(buttonBMatch[1]),
            yOffset: parseInt(buttonBMatch[2])
        }
    }

    if (prizeMatch !== null) {
        machines.push({
            buttonA: currentButtonA,
            buttonB: currentButtonB,
            prize: {
                x: parseInt(prizeMatch[1]),
                y: parseInt(prizeMatch[2])
            }
        });
    }

    if (last) {
        const fewestTokens = machines.map(machine => findFewestTokens(machine)).reduce((acc, val) => acc + val, 0);

        console.log(`The fewest tokens needed to win all prizes is ${fewestTokens}`);
        console.timeEnd(timer);
    }
});
