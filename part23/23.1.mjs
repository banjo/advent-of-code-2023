import { attempt, isDefined, isEqual } from "@banjoanton/utils";
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

    toString() {
        return `${this.x},${this.y}`;
    }
}

const directionMap = {
    U: ({ x, y }) => new Point({ x, y: y - 1 }),
    R: ({ x, y }) => new Point({ x: x + 1, y }),
    D: ({ x, y }) => new Point({ x, y: y + 1 }),
    L: ({ x, y }) => new Point({ x: x - 1, y }),
};

const arrowMap = {
    ">": "R",
    "<": "L",
    v: "D",
    "^": "U",
};

const start = getStarter(grid);
const end = getEnd(grid);
const visited = recurse(start, grid, end);

const points = Object.values(visited);
console.log(points.length - 1);
visualize(grid, points);

function recurse(point, grid, end, vis = {}) {
    const queue = [point];
    let visited = structuredClone(vis);
    while (queue.length > 0) {
        const current = queue.shift();
        visited[current] = current;

        if (isEqual(current, end)) {
            return visited;
        }

        const possible = possibleNewPoints(current, grid, visited);

        if (possible.length === 1) {
            const point = possible[0];
            queue.push(point);
            continue;
        }

        const allVisited = possible
            .map((point) => recurse(point, grid, end, visited))
            .filter(isDefined);

        const longest = allVisited.reduce((acc, current) => {
            const isLonger =
                Object.keys(current).length > Object.keys(acc).length;

            return isLonger ? current : acc;
        }, {});

        visited = { ...visited, ...longest };

        if (visited[end]) {
            return visited;
        }
    }

    return undefined;
}

function getStarter(grid) {
    const startIndex = grid[0].indexOf(".");
    return new Point({ y: 0, x: startIndex });
}

function getEnd(grid) {
    const y = grid.length - 1;
    const endIndex = grid[y].indexOf(".");
    return new Point({ y, x: endIndex });
}

function possibleNewPoints(point, grid, visited) {
    return Object.values(directionMap)
        .map((fn) => fn(point))
        .filter((point, idx) => {
            const { x, y } = point;
            const symbol = attempt(() => grid[y][x]);
            if (!symbol || symbol === "#") return false;
            if (visited[point]) return false;
            const currentDirection = Object.keys(directionMap)[idx];

            const arrows = Object.keys(arrowMap);
            if (arrows.includes(symbol)) {
                const direction = arrowMap[symbol];

                if (direction !== currentDirection) {
                    return false;
                }
            }

            return true;
        });
}
