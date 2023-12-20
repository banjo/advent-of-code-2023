import { isDefined, isEqual } from "@banjoanton/utils";
import fs from "fs";

const grids = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n\n")
    .map((entry) => entry.split("\n").map((line) => line.split("")));

let total = 0;

for (const grid of grids) {
    const score = handleGrid(grid);
    total += score;
}

console.log(total);

function handleGrid(grid) {
    const horizontal = checkMirrors(grid);

    if (horizontal) {
        return (horizontal - 1) * 100;
    }

    const vertical = checkMirrors(swap(grid));
    return vertical - 1;
}

function swap(grid) {
    const horizontalLength = grid[0].length;
    const verticalLength = grid.length;
    const newGrid = [];
    for (let i = 0; i < horizontalLength; i++) {
        const newLine = [];
        for (let j = 0; j < verticalLength; j++) {
            const element = grid[j][i];
            newLine.push(element);
        }
        newGrid.push(newLine);
    }

    return newGrid;
}

function checkMirrors(grid) {
    let gridNumber;

    let prev;
    for (const [index, line] of grid.entries()) {
        const lineNumber = index + 1;
        if (!isEqual(line, prev)) {
            prev = line;
            continue;
        }

        const isMirrored = isFullyMirrored(grid, index);

        if (!isMirrored) {
            prev = line;
            continue;
        }

        gridNumber = lineNumber;
        break;
    }

    return gridNumber;
}

function isFullyMirrored(grid, index) {
    for (let i = 0; i < grid.length; i++) {
        const beforeIndex = index - 2 - i;
        const before = grid[beforeIndex];

        const afterIndex = index + 1 + i;
        const after = grid[afterIndex];

        const isOutside = !isDefined(after) || !isDefined(before);

        if (isOutside) {
            return true;
        }

        if (!isEqual(before, after)) {
            return false;
        }

        const isAtEdge = beforeIndex === 0 || afterIndex === grid.length - 1;
        if (isAtEdge) {
            return true;
        }
    }

    return false;
}
