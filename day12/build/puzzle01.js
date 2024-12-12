"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 12, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
function exploreArea(grid, areas, handledPlants, discoveredPlants, plant) {
    const area = {
        plantName: plant.name,
        perimeter: 0,
        plants: []
    };
    const localHandledPlants = new Set();
    function isValidPosition(position) {
        return position.x >= 0 && position.x < grid[0].length && position.y >= 0 && position.y < grid.length;
    }
    function isAreaPlant(position, areaName) {
        return isValidPosition(position) && grid[position.y][position.x] === areaName;
    }
    function registerNonAreaPlant(plant) {
        if (!handledPlants.has(`${plant.y},${plant.x}`)) {
            discoveredPlants.push(plant);
        }
    }
    const discoveredAreaPlants = [plant];
    do {
        let perimeter = 4;
        const areaPlant = discoveredAreaPlants.pop();
        area.plants.push(areaPlant);
        handledPlants.add(`${areaPlant.y},${areaPlant.x}`);
        localHandledPlants.add(`${areaPlant.y},${areaPlant.x}`);
        let directions = [
            // left
            { x: areaPlant.x - 1, y: areaPlant.y },
            // right
            { x: areaPlant.x + 1, y: areaPlant.y },
            // up
            { x: areaPlant.x, y: areaPlant.y - 1 },
            // down
            { x: areaPlant.x, y: areaPlant.y + 1 }
        ];
        directions.forEach(direction => {
            if (isAreaPlant(direction, area.plantName)) {
                if (!localHandledPlants.has(`${direction.y},${direction.x}`)) {
                    discoveredAreaPlants.push({ ...direction, name: grid[direction.y][direction.x] });
                    localHandledPlants.add(`${direction.y},${direction.x}`);
                }
                perimeter--;
            }
            else if (isValidPosition(direction)) {
                registerNonAreaPlant({ ...direction, name: grid[direction.y][direction.x] });
            }
        });
        area.perimeter += perimeter;
    } while (discoveredAreaPlants.length > 0);
    areas.push(area);
}
const grid = [];
const discoveredPlants = [];
const handledPlants = new Set();
const areas = [];
const timer = "Execution time";
console.time(timer);
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    grid.push(line.split(""));
    if (last) {
        discoveredPlants.push({ x: 0, y: 0, name: grid[0][0] });
        while (discoveredPlants.length > 0) {
            const discoveredPlant = discoveredPlants.pop();
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
//# sourceMappingURL=puzzle01.js.map