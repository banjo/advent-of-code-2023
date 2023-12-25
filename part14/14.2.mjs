import { attempt, isUndefined } from "@banjoanton/utils";
import fs from "fs";

const originalGrid = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .map((line) => line.split(""));

const iteratorMap = {
    north: (grid, i, j, verticalLength, horizontalLength) => {
        return { element: grid[i][j], i, j };
    },
    west: (grid, i, j, verticalLength, horizontalLength) => {
        const newI = verticalLength - 1 - i;
        return { element: grid[newI][j], i: newI, j };
    },
    south: (grid, i, j, verticalLength, horizontalLength) => {
        const newI = verticalLength - i - 1;
        return { element: grid[newI][j], i: newI, j };
    },
    east: (grid, i, j, verticalLength, horizontalLength) => {
        const newJ = horizontalLength - j - 1;
        return { element: grid[i][newJ], j: newJ, i };
    },
};

const ITERATIONS = 1000000000;
const { loopLength, iterated, grid: loopedGrid } = getLoopLength(originalGrid);
const leftToLoop = (ITERATIONS - iterated) % loopLength;

let grid = loopedGrid;
for (let j = 0; j < leftToLoop; j++) {
    grid = cycle(grid);
}

console.log(getScore(grid));

function getLoopLength(originalGrid) {
    const iterated = [];
    let loopLength = 0;
    let i = -1;
    let grid = originalGrid;
    while (true) {
        i++;

        const key = grid.map((l) => l.join("")).join("");
        if (iterated.includes(key)) {
            const index = iterated.indexOf(key);
            loopLength = iterated.length - index;
            break;
        }
        grid = cycle(grid);
        iterated.push(key);
    }

    return { loopLength, iterated: i, grid };
}

function cycle(grid) {
    Object.keys(iteratorMap).forEach((key) => {
        grid = iterate(grid, key, handler);
    });

    return grid;
}

function handler(element, grid, y, x, direction) {
    if (element !== "O") {
        return grid;
    }

    let toCheck = next(y, x, direction);

    if (isUndefined(toCheck)) {
        return grid;
    }

    let previous = { x, y };
    while (true) {
        toCheck = next(previous.y, previous.x, direction);

        if (isUndefined(toCheck)) {
            break;
        }

        const nextElement = get(grid, toCheck.y, toCheck.x);
        if (nextElement !== ".") {
            break;
        }

        previous = toCheck;
    }

    if (y === previous.y && x === previous.x) {
        return grid;
    }

    grid[y][x] = ".";
    grid[previous.y][previous.x] = "O";

    return grid;
}

function getScore(grid) {
    const length = grid.length;

    let lineScore = length;
    let totalScore = 0;
    for (const line of grid) {
        const amount = line.filter((p) => p === "O").length;
        totalScore += lineScore * amount;
        lineScore--;
    }

    return totalScore;
}

function get(grid, y, x) {
    return attempt(() => grid[y][x]);
}

function next(y, x, direction) {
    let nextValue = { x, y };

    if (direction === "north") {
        nextValue = { x, y: y - 1 };
    } else if (direction === "west") {
        nextValue = { x: x - 1, y };
    } else if (direction === "south") {
        nextValue = { x, y: y + 1 };
    } else if (direction === "east") {
        nextValue = { x: x + 1, y };
    }

    if (nextValue.x < 0 || nextValue.y < 0) {
        return undefined;
    }

    return nextValue;
}

function iterate(grid, direction, handler) {
    let newGrid = grid;
    const horizontalLength = grid[0].length;
    const verticalLength = grid.length;
    const getter = iteratorMap[direction];

    for (let i = 0; i < verticalLength; i++) {
        for (let j = 0; j < horizontalLength; j++) {
            const {
                element,
                i: newI,
                j: newJ,
            } = getter(newGrid, i, j, verticalLength, horizontalLength);

            newGrid = handler(element, newGrid, newI, newJ, direction);
        }
    }

    return newGrid;
}
