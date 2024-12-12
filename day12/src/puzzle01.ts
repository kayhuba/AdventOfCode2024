console.log("Day 12, Puzzle 01!")

import lineReader from "line-reader";

interface Position {
    x: number;
    y: number;
}

interface Plant extends Position{
    name: string;
}

interface Area {
    plantName: string;
    perimeter: number;
    plants: Plant[];
}

function exploreArea(grid: string[][], areas: Area[], handledPlants: Set<string>, discoveredPlants: Plant[], plant: Plant) {
    const area: Area = {
        plantName: plant.name,
        perimeter: 0,
        plants: []
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

    const discoveredAreaPlants: Plant[] = [plant];
    do {
        let perimeter = 4;
        const areaPlant = discoveredAreaPlants.pop() as Plant;
        area.plants.push(areaPlant);
        handledPlants.add(`${areaPlant.y},${areaPlant.x}`);
        localHandledPlants.add(`${areaPlant.y},${areaPlant.x}`);

        let directions: Position[] = [
            // left
            { x: areaPlant.x - 1, y: areaPlant.y},
            // right
            { x: areaPlant.x + 1, y: areaPlant.y},
            // up
            { x: areaPlant.x, y: areaPlant.y - 1},
            // down
            { x: areaPlant.x, y: areaPlant.y + 1}
        ];
        directions.forEach(direction => {
            if (isAreaPlant(direction, area.plantName)) {
                if (!localHandledPlants.has(`${direction.y},${direction.x}`)) {
                    discoveredAreaPlants.push({...direction, name: grid[direction.y][direction.x]});
                    localHandledPlants.add(`${direction.y},${direction.x}`);
                }

                perimeter--;
            } else if (isValidPosition(direction)) {
                registerNonAreaPlant({...direction, name: grid[direction.y][direction.x]});
            }
        });

        area.perimeter += perimeter;
    } while (discoveredAreaPlants.length > 0);

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
            const price = area.plants.length * area.perimeter;
            console.log(`A region of ${area.plantName} plants with price ${area.plants.length} * ${area.perimeter} = ${price}`);
            return price;
        }).reduce((acc, price) => acc + price, 0);

        console.log(`Total price: ${totalPrice}`);

        console.timeEnd(timer);
    }
});

