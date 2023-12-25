import { attempt, isUndefined } from "@banjoanton/utils";
import fs from "fs";

const originalGrid = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .map((line) => line.split(""));

const newGrid = iterate(originalGrid, (element, grid, y, x) => {
    if (element !== "O") {
        return grid;
    }

    let toCheck = next(y, x, "north");

    if (isUndefined(toCheck)) {
        return grid;
    }

    let previous = { x, y };
    while (true) {
        toCheck = next(previous.y, previous.x, "north");

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
});

console.log(getScore(newGrid));

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
    }

    if (nextValue.x < 0 || nextValue.y < 0) {
        return undefined;
    }

    return nextValue;
}

function iterate(grid, handler) {
    let newGrid = grid;
    const horizontalLength = grid[0].length;
    const verticalLength = grid.length;

    for (let i = 0; i < verticalLength; i++) {
        for (let j = 0; j < horizontalLength; j++) {
            const element = newGrid[i][j];
            newGrid = handler(element, newGrid, i, j);
        }
    }

    return newGrid;
}
