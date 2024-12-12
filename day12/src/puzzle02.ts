console.log("Day 12, Puzzle 02!")

import lineReader from "line-reader";

enum Side {
    TOP,
    RIGHT,
    BOTTOM,
    LEFT
}

interface Position {
    x: number;
    y: number;
}

interface Plant extends Position{
    name: string;
}

interface AreaSide {
    start: Position;
    end: Position;
    side: Side;
}

interface Area {
    plantName: string;
    perimeter: number;
    plants: Plant[];
    sides: AreaSide[];
}

interface Direction extends Position {
    side: Side;
}

function connectTopSide(first: AreaSide, second: AreaSide): boolean  {
    if (first.side !== Side.TOP) {
        return false;
    }

    if (second.side !== Side.TOP) {
        return false;
    }

    if (first.start.y !== second.end.y) {
        return false;
    }

    // is it adjacent to the right?
    if (first.end.x === second.start.x) {
        first.end.x = second.end.x;
        return true;
    }

    // is it adjacent to the left?
    if (first.start.x === second.end.x) {
        first.start.x = second.start.x;
        return true;
    }

    return false;
}

function connectRightSide(first: AreaSide, second: AreaSide): boolean {
    if (first.side !== Side.RIGHT) {
        return false;
    }

    if (second.side !== Side.RIGHT) {
        return false;
    }

    if (first.start.x !== second.start.x) {
        return false;
    }

    // is it adjacent to the bottom?
    if (first.end.y === second.start.y) {
        first.end.y = second.end.y;
        return true;
    }

    // is it adjacent to the top?
    if (first.start.y === second.end.y) {
        first.start.y = second.start.y;
        return true;
    }

    return false;
}

function connectBottomSide(first: AreaSide, second: AreaSide): boolean {
    if (first.side !== Side.BOTTOM) {
        return false;
    }

    if (second.side !== Side.BOTTOM) {
        return false;
    }

    if (first.start.y !== second.start.y) {
        return false;
    }

    // is it adjacent to the right?
    if (first.end.x === second.start.x) {
        first.end.x = second.end.x;
        return true;
    }

    // is it adjacent to the left?
    if (first.start.x === second.end.x) {
        first.start.x = second.start.x;
        return true;
    }

    return false;
}

function connectLeftSide(first: AreaSide, second: AreaSide): boolean {
    if (first.side !== Side.LEFT) {
        return false;
    }

    if (second.side !== Side.LEFT) {
        return false;
    }

    if (first.start.x !== second.start.x) {
        return false;
    }

    // is it adjacent to the bottom?
    if (first.end.y === second.start.y) {
        first.end.y = second.end.y;
        return true;
    }

    // is it adjacent to the top?
    if (first.start.y === second.end.y) {
        first.start.y = second.start.y;
        return true;
    }

    return false;
}

function exploreArea(grid: string[][], areas: Area[], handledPlants: Set<string>, discoveredPlants: Plant[], plant: Plant) {
    const area: Area = {
        plantName: plant.name,
        perimeter: 0,
        plants: [],
        sides: []
    };
    const localHandledPlants: Set<string> = new Set();

    function isValidPosition(position: Position): boolean {
        return position.x >= 0 && position.x < grid[0].length && position.y >= 0 && position.y < grid.length;
    }

    function isAreaPlant(position: Position, areaName: string): boolean {
        return isValidPosition(position) && grid[position.y][position.x] === areaName;
    }

    function registerNonAreaPlant(plant: Plant) {
        if (!handledPlants.has(`${plant.y},${plant.x}`)) {
            discoveredPlants.push(plant);
        }
    }

    function connectSide(plant: Plant, side: Side, areaSides: AreaSide[]) {
        const relevantSides = areaSides.filter(areaSide => areaSide.side === side);
        if (side === Side.TOP) {
            const potentialAreaSide = {
                start: { x: plant.x, y: plant.y },
                end: { x: plant.x + 1, y: plant.y },
                side: Side.TOP
            };

            for (let i=0; i < relevantSides.length; i++) {
                if (relevantSides[i].start.y !== plant.y) {
                    continue;
                }

                if (connectTopSide(relevantSides[i], potentialAreaSide)) {
                    return;
                }
            }

            // at this point we have no existing side to connect to
            areaSides.push(potentialAreaSide);
        } else if (side === Side.RIGHT) {
            const potentialAreaSide = {
                start: { x: plant.x + 1, y: plant.y },
                end: { x: plant.x + 1, y: plant.y + 1 },
                side: Side.RIGHT
            };

            for (let i=0; i < relevantSides.length; i++) {
                if (relevantSides[i].start.x !== plant.x + 1) {
                    continue;
                }

                if (connectRightSide(relevantSides[i], potentialAreaSide)) {
                    return;
                }
            }

            // at this point we have no existing side to connect to
            areaSides.push(potentialAreaSide);
        } else if (side === Side.BOTTOM) {
            const potentialAreaSide = {
                start: { x: plant.x, y: plant.y + 1},
                end: { x: plant.x + 1, y: plant.y + 1},
                side: Side.BOTTOM
            };

            for (let i=0; i < relevantSides.length; i++) {
                if (relevantSides[i].start.y !== plant.y + 1) {
                    continue;
                }

                if (connectBottomSide(relevantSides[i], potentialAreaSide)) {
                    return;
                }
            }

            // at this point we have no existing side to connect to
            areaSides.push(potentialAreaSide);
        } else if (side === Side.LEFT) {
            const potentialAreaSide = {
                start: {x: plant.x, y: plant.y},
                end: {x: plant.x, y: plant.y + 1},
                side: Side.LEFT
            };

            for (let i=0; i < relevantSides.length; i++) {
                if (relevantSides[i].start.x !== plant.x) {
                    continue;
                }

                if (connectLeftSide(relevantSides[i], potentialAreaSide)) {
                    return;
                }
            }

            // at this point we have no existing side to connect to
            areaSides.push(potentialAreaSide);
        }
    }

    const discoveredAreaPlants: Plant[] = [plant];
    do {
        let perimeter = 4;
        const areaPlant = discoveredAreaPlants.pop() as Plant;
        area.plants.push(areaPlant);
        handledPlants.add(`${areaPlant.y},${areaPlant.x}`);
        localHandledPlants.add(`${areaPlant.y},${areaPlant.x}`);

        let directions: Direction[] = [
            // left
            { x: areaPlant.x - 1, y: areaPlant.y, side: Side.LEFT },
            // right
            { x: areaPlant.x + 1, y: areaPlant.y, side: Side.RIGHT },
            // up
            { x: areaPlant.x, y: areaPlant.y - 1, side: Side.TOP},
            // down
            { x: areaPlant.x, y: areaPlant.y + 1, side: Side.BOTTOM }
        ];
        const directionsWithSides = [...directions].filter(direction => {
            if (isAreaPlant(direction, area.plantName)) {
                if (!localHandledPlants.has(`${direction.y},${direction.x}`)) {
                    discoveredAreaPlants.push({x: direction.x, y: direction.y, name: grid[direction.y][direction.x]});
                    localHandledPlants.add(`${direction.y},${direction.x}`);
                }

                perimeter--;
                return false;
            } else if (isValidPosition(direction)) {
                registerNonAreaPlant({...direction, name: grid[direction.y][direction.x]});
            }
            return true;
        });
        directionsWithSides.forEach(direction => connectSide(areaPlant, direction.side, area.sides));

        area.perimeter += perimeter;
    } while (discoveredAreaPlants.length > 0);

    // at this point, we need to merge sides, that are actually adjacent
    const areaSidePairsWithMatchingSides = area.sides.map((_, sideIndex) =>
        area.sides
            .map((_, otherSideIndex) => otherSideIndex)
            .filter(otherSideIndex => otherSideIndex !== sideIndex)
            .filter(otherSideIndex => area.sides[sideIndex].side === area.sides[otherSideIndex].side)
            .map(otherSideIndex => [sideIndex, otherSideIndex])
    ).flat();

    const sideIndexesToRemove: Set<number> = new Set();
    areaSidePairsWithMatchingSides.forEach(([sideIndex, otherSideIndex]) => {
        switch(area.sides[sideIndex].side) {
            case Side.TOP:
                if (connectTopSide(area.sides[sideIndex], area.sides[otherSideIndex])) {
                    sideIndexesToRemove.add(otherSideIndex);
                    return;
                }
                break;
            case Side.RIGHT:
                if (connectRightSide(area.sides[sideIndex], area.sides[otherSideIndex])) {
                    sideIndexesToRemove.add(otherSideIndex);
                    return;
                }
                break;
            case Side.BOTTOM:
                if (connectBottomSide(area.sides[sideIndex], area.sides[otherSideIndex])) {
                    sideIndexesToRemove.add(otherSideIndex);
                    return;
                }
                break;
            case Side.LEFT:
                if (connectLeftSide(area.sides[sideIndex], area.sides[otherSideIndex])) {
                    sideIndexesToRemove.add(otherSideIndex);
                    return;
                }
                break;
        }
    });

    const sortedSideIndexesToRemove = Array.from(sideIndexesToRemove).sort((a, b) => b - a);
    sortedSideIndexesToRemove.forEach(index => area.sides.splice(index, 1));

    areas.push(area);
}

const grid: string[][] = [];
const discoveredPlants: Plant[] = [];
const handledPlants: Set<string> = new Set();
const areas: Area[] = [];

const timer = "Execution time";
console.time(timer);
lineReader.eachLine("./input/input.txt", (line, last) => {
    grid.push(line.split(""));

    if (last) {
        discoveredPlants.push({ x: 0, y: 0, name: grid[0][0] });
        while (discoveredPlants.length > 0) {
            const discoveredPlant = discoveredPlants.pop() as Plant;
            if (handledPlants.has(`${discoveredPlant.y},${discoveredPlant.x}`)) {
                continue;
            }

            exploreArea(grid, areas, handledPlants, discoveredPlants, discoveredPlant);
        }

        const totalPrice = areas.map(area => {
            const price = area.plants.length * area.sides.length;
            console.log(`A region of ${area.plantName} plants with price ${area.plants.length} * ${area.sides.length} = ${price}`);
            return price;
        }).reduce((acc, price) => acc + price, 0);

        console.log(`Total price: ${totalPrice}`);

        console.timeEnd(timer);
    }
});

