import { attempt, isUndefined } from "@banjoanton/utils";
import fs from "fs";
import { visualize } from "./visualize.mjs";

class Point {
    constructor({
        x,
        y,
        symbol,
        incomingDirection = null,
        outgoingDirections = [],
    }) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.incomingDirection = incomingDirection;
        this.outgoingDirections = outgoingDirections;
    }
}

const vertical = ["U", "D"];
const horizontal = ["L", "R"];

const matrixMap = {
    U: ({ x, y }) => ({ x, y: y - 1 }),
    D: ({ x, y }) => ({ x, y: y + 1 }),
    R: ({ x, y }) => ({ x: x + 1, y }),
    L: ({ x, y }) => ({ x: x - 1, y }),
};

const symbolsMap = {
    ".": (direction) => [direction],
    "-": (direction) => {
        if (horizontal.includes(direction)) {
            return [direction];
        } else {
            return structuredClone(horizontal);
        }
    },
    "|": (direction) => {
        if (vertical.includes(direction)) {
            return [direction];
        } else {
            return structuredClone(vertical);
        }
    },
    "\\": (direction) => {
        const mirrorDirections = {
            U: "L",
            R: "D",
            L: "U",
            D: "R",
        };
        return [mirrorDirections[direction]];
    },
    "/": (direction) => {
        const mirrorDirections = {
            U: "R",
            R: "U",
            L: "D",
            D: "L",
        };
        return [mirrorDirections[direction]];
    },
};

const grid = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .map((line) => line.split(""));

const startPoint = new Point({
    x: 0,
    y: 0,
    symbol: grid[0][0],
    outgoingDirections: symbolsMap[grid[0][0]]("R"),
});

const visited = [];
const queue = [startPoint];
const visitedPoints = [{ x: startPoint.x, y: startPoint.y }];

while (queue.length) {
    const current = queue.shift();
    visited.push(current);

    current.outgoingDirections.forEach((direction) => {
        const { x, y } = matrixMap[direction](current);
        const symbol = attempt(() => grid[y][x]);

        if (isUndefined(symbol)) return;
        const outgoingDirections = symbolsMap[symbol](direction);

        if (!visitedPoints.some((point) => isPathEqual(point, { x, y }))) {
            visitedPoints.push({ x, y });
        }

        if (
            !visited.some((point) =>
                isPointEqual(point, { x, y, incomingDirection: direction })
            )
        ) {
            queue.push(
                new Point({
                    x,
                    y,
                    symbol,
                    incomingDirection: direction,
                    outgoingDirections,
                })
            );
        }
    });
}

console.log(visitedPoints.length);
visualize(grid, visited);

function isPointEqual(point1, point2) {
    return (
        point1.x === point2.x &&
        point1.y === point2.y &&
        point1.incomingDirection === point2.incomingDirection
    );
}

function isPathEqual(path1, path2) {
    return path1.x === path2.x && path1.y === path2.y;
}
