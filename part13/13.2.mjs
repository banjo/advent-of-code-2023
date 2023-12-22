import { isDefined, isEqual, produce } from "@banjoanton/utils";
import fs from "fs";

const grids = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n\n")
    .map((entry) => entry.split("\n").map((line) => line.split("")));

let total = 0;

for (const grid of grids) {
    const invalidResult = handleGrid(grid);
    iterate(grid, (grid) => {
        const result = handleGrid(grid, invalidResult);

        if (result === null) {
            return false;
        }

        total += result.score;
        return true;
    });
}

console.log(total);

function isSameScore(result, secondResult) {
    return (
        result !== null &&
        secondResult !== null &&
        result?.isHorizontal === secondResult?.isHorizontal &&
        result?.line === secondResult?.line
    );
}

function iterate(grid, handler) {
    const horizontalLength = grid[0].length;
    const verticalLength = grid.length;

    const change = (point) => (point === "." ? "#" : ".");

    for (let i = 0; i < verticalLength; i++) {
        for (let j = 0; j < horizontalLength; j++) {
            const element = grid[i][j];
            const updatedGrid = produce(grid, (draft) => {
                draft[i][j] = change(element);
            });

            const isDone = handler(updatedGrid);
            if (isDone) return true;
        }
    }

    return false;
}

function handleGrid(grid, ignore = null) {
    const horizontal = checkMirrors(grid, true, ignore);

    if (horizontal) {
        const newScore = {
            isHorizontal: true,
            score: (horizontal - 1) * 100,
            line: horizontal,
        };

        if (!isSameScore(newScore, ignore)) {
            return newScore;
        }
    }

    const vertical = checkMirrors(swap(grid), false, ignore);
    if (vertical) {
        const newScore = {
            isHorizontal: false,
            score: vertical - 1,
            line: vertical,
        };

        if (!isSameScore(newScore, ignore)) {
            return newScore;
        }
    }

    return null;
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

function checkMirrors(grid, isHorizontal, ignore = null) {
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

        const shouldIgnore =
            ignore &&
            ignore.isHorizontal === isHorizontal &&
            ignore.line === lineNumber;

        if (shouldIgnore) {
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
