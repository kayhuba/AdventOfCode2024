"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Day 08, Puzzle 01!");
const line_reader_1 = __importDefault(require("line-reader"));
function isValidAntinode(antinode, width, height) {
    return antinode.x >= 0 && antinode.x < width && antinode.y >= 0 && antinode.y < height;
}
function findAndApplyAntinodes(antennaPair, antinodeLocations, width, height) {
    antennaPair.sort((a, b) => a.y - b.y || a.x - b.x);
    const firstAntinode = {
        x: antennaPair[0].x - (antennaPair[1].x - antennaPair[0].x),
        y: antennaPair[0].y - (antennaPair[1].y - antennaPair[0].y)
    };
    if (isValidAntinode(firstAntinode, width, height)) {
        antinodeLocations.add(`${firstAntinode.x},${firstAntinode.y}`);
    }
    const secondAntinode = {
        x: antennaPair[1].x - (antennaPair[0].x - antennaPair[1].x),
        y: antennaPair[1].y - (antennaPair[0].y - antennaPair[1].y)
    };
    if (isValidAntinode(secondAntinode, width, height)) {
        antinodeLocations.add(`${secondAntinode.x},${secondAntinode.y}`);
    }
}
let lineCount = 0;
const antennas = new Map();
line_reader_1.default.eachLine("./input/input.txt", (line, last) => {
    line.split("").forEach((potentialAntenna, index) => {
        if (potentialAntenna === ".") {
            return;
        }
        const position = { x: index, y: lineCount };
        if (!antennas.has(potentialAntenna)) {
            antennas.set(potentialAntenna, []);
        }
        antennas.get(potentialAntenna).push(position);
    });
    lineCount++;
    if (last) {
        const antinodeLocations = new Set();
        antennas.forEach((antennaPositions, antennaName) => {
            const antennaPairs = antennaPositions.map((antennaPosition, index) => [...antennaPositions.slice(0, index), ...antennaPositions.slice(index + 1)].map((otherAntennaPosition) => [antennaPosition, otherAntennaPosition])).flat();
            antennaPairs.forEach(antennaPair => findAndApplyAntinodes(antennaPair, antinodeLocations, line.length, lineCount));
        });
        console.log(`Unique locations of antinodes: ${antinodeLocations.size}`);
    }
});
//# sourceMappingURL=puzzle01.js.map