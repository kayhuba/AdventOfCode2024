console.log("Day 08, Puzzle 01!")

import lineReader from "line-reader";

interface Position {
    x: number;
    y: number;
}

function isValidAntinode(antinode: Position, width: number, height: number): boolean {
    return antinode.x >= 0 && antinode.x < width && antinode.y >= 0 && antinode.y < height;
}

function findAndApplyAntinodes(antennaPair: [Position, Position], antinodeLocations: Set<string>, width: number, height: number): void {
    antennaPair.sort((a, b) => a.y - b.y || a.x - b.x);

    const firstAntinode: Position = {
        x: antennaPair[0].x - (antennaPair[1].x - antennaPair[0].x),
        y: antennaPair[0].y - (antennaPair[1].y - antennaPair[0].y)
    };

    if (isValidAntinode(firstAntinode, width, height)) {
        antinodeLocations.add(`${firstAntinode.x},${firstAntinode.y}`);
    }

    const secondAntinode: Position = {
        x: antennaPair[1].x - (antennaPair[0].x - antennaPair[1].x),
        y: antennaPair[1].y - (antennaPair[0].y - antennaPair[1].y)
    };

    if (isValidAntinode(secondAntinode, width, height)) {
        antinodeLocations.add(`${secondAntinode.x},${secondAntinode.y}`);
    }
}

let lineCount = 0;
const antennas: Map<string, Position[]> = new Map();
lineReader.eachLine("./input/input.txt", (line, last) => {
    line.split("").forEach((potentialAntenna, index) => {
        if (potentialAntenna === ".") {
            return;
        }

        const position: Position = { x: index, y: lineCount };
        if (!antennas.has(potentialAntenna)) {
            antennas.set(potentialAntenna, []);
        }

        antennas.get(potentialAntenna)!.push(position);
    });

    lineCount++;
    if (last) {
        const antinodeLocations: Set<string> = new Set();

        antennas.forEach((antennaPositions, antennaName) => {
            const antennaPairs = antennaPositions.map((antennaPosition, index) =>
                [...antennaPositions.slice(0, index), ...antennaPositions.slice(index + 1)].map((otherAntennaPosition) => [antennaPosition, otherAntennaPosition])
            ).flat();

            antennaPairs.forEach(antennaPair => findAndApplyAntinodes(antennaPair as [Position, Position], antinodeLocations, line.length, lineCount));
        });

        console.log(`Unique locations of antinodes: ${antinodeLocations.size}`);
    }
});
