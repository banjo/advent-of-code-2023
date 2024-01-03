import { ObjectSet, attempt } from "@banjoanton/utils";
import fs from "fs";
import { visualize } from "./visualize.mjs";

const grid = fs
    .readFileSync("./input.txt", "utf-8")
    .split("\n")
    .map((entry) => entry.split(""));

class Point {
    constructor({ x, y }) {
        this.x = x;
        this.y = y;
    }
}

const directionMap = {
    U: ({ x, y }) => new Point({ x, y: y - 1 }),
    R: ({ x, y }) => new Point({ x: x + 1, y }),
    D: ({ x, y }) => new Point({ x, y: y + 1 }),
    L: ({ x, y }) => new Point({ x: x - 1, y }),
};

const starter = getStarter(grid);
const STEPS = 64;
const queue = [[starter]];
let i = 0;
while (queue.length > 0) {
    i++;

    if (i === STEPS + 1) {
        break;
    }

    const points = queue.shift();
    const tempQueue = new ObjectSet();
    points.forEach((p) => {
        const newPoints = possibleNewPoints(p, grid);
        newPoints.forEach((p) => tempQueue.add(p));
    });

    queue.push(tempQueue.values);
}

console.log(queue[0].length);
visualize(grid, queue[0]);

function getStarter(grid) {
    let starter;
    iterate(grid, (element, grid, i, j) => {
        if (element === "S") {
            starter = new Point({ x: i, y: j });
        }
        return grid;
    });

    return starter;
}

function possibleNewPoints(point, grid) {
    return Object.values(directionMap)
        .map((fn) => fn(point))
        .filter((point) => {
            const { x, y } = point;
            const symbol = attempt(() => grid[y][x]);
            if (!symbol || symbol === "#") return false;
            return true;
        });
}

function iterate(grid, handler) {
    let newGrid = grid;
    const horizontalLength = grid[0].length;
    const verticalLength = grid.length;

    for (let i = 0; i < verticalLength; i++) {
        for (let j = 0; j < horizontalLength; j++) {
            const element = newGrid[j][i];
            newGrid = handler(element, newGrid, i, j);
        }
    }

    return newGrid;
}
