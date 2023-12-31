import { attempt, isDefined, isUndefined } from "@banjoanton/utils";
import fs from "fs";

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
    R: ({ x, y }) => ({ x: x + 1, y }),
    D: ({ x, y }) => ({ x, y: y + 1 }),
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

let max = 0;
for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
        const point = { x: i, y: j };
        const directions = getEdgeDirection(point);

        directions.forEach((direction) => {
            const startPoint = new Point({
                x: i,
                y: j,
                symbol: grid[j][i],
                outgoingDirections: symbolsMap[grid[j][i]](direction),
            });
            max = Math.max(max, getVisited(startPoint));
        });
    }
}

console.log(max);

function getEdgeDirection(point) {
    const directions = Object.values(matrixMap).map((predicate) => {
        const { x, y } = predicate(point);
        return attempt(() => grid[y][x]);
    });

    if (directions.every(isDefined)) {
        return [];
    }

    const [up, right, down, left] = directions;

    const getDir = (variable, direction) => {
        return variable ? undefined : direction;
    };

    return [
        getDir(up, "D"),
        getDir(right, "L"),
        getDir(down, "U"),
        getDir(left, "R"),
    ].filter(isDefined);
}

function getVisited(startPoint) {
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

    return visitedPoints.length;
}

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
