console.log("Day 08, Puzzle 02!")

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

    let counter = 0;
    const diffXOne = antennaPair[1].x - antennaPair[0].x;
    const diffYOne = antennaPair[1].y - antennaPair[0].y;
    while (isValidAntinode({x: antennaPair[0].x - diffXOne * counter, y: antennaPair[0].y - diffYOne * counter}, width, height)) {
        antinodeLocations.add(`${antennaPair[0].x - diffXOne * counter},${antennaPair[0].y - diffYOne * counter}`);
        counter++;
    }

    counter = 0;
    const diffXTwo = antennaPair[0].x - antennaPair[1].x;
    const diffYTwo = antennaPair[0].y - antennaPair[1].y;
    while (isValidAntinode({x: antennaPair[1].x - diffXTwo * counter, y: antennaPair[1].y - diffYTwo * counter}, width, height)) {
        antinodeLocations.add(`${antennaPair[1].x - diffXTwo * counter},${antennaPair[1].y - diffYTwo * counter}`);
        counter++;
    }
}

let lineCount = 0;
const antennas: Map<string, Position[]> = new Map();
const antennaGrid: Map<string, string> = new Map();
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

        antennaGrid.set(`${index},${lineCount}`, potentialAntenna);
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

        for (let y = 0; y < lineCount; y++) {
            let gridLine = "";
            for (let x = 0; x < line.length; x++) {
                if (antennaGrid.has(`${x},${y}`)) {
                    gridLine += antennaGrid.get(`${x},${y}`);
                } else if (antinodeLocations.has(`${x},${y}`)){
                    gridLine += "#";
                } else {
                    gridLine += ".";
                }
            }
            console.log(gridLine);
        }

        console.log(`Unique locations of antinodes: ${antinodeLocations.size}`);
    }
});
