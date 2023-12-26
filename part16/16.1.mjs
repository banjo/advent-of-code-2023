import { isDefined, isUndefined } from "@banjoanton/utils";
import fs from "fs";
import TinyQueue from "tinyqueue";
import { visualize } from "./visualize.mjs";

const grid = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .map((line) => line.split("").map(Number));

class Position {
    constructor({
        x,
        y,
        direction,
        priority = 0,
        stepsTaken = 0,
        straightSteps = 0,
        previousPositions = [],
    }) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.priority = priority;
        this.stepsTaken = stepsTaken;
        this.straightSteps = straightSteps;
        this.previousPositions = previousPositions;
    }

    setPriority(newPriority) {
        this.priority = newPriority;
    }

    addPreviousPosition(position) {
        this.previousPositions.push(position);
    }

    hasVisitedPosition(position) {
        return this.previousPositions.some(
            (p) => p.x === position.x && position.y === p.y
        );
    }

    toString() {
        return `[${this.x},${this.y},${this.direction},${this.straightSteps}]`;
    }

    static fromString(str) {
        const [, x, y, direction, straightSteps] = str.match(
            /\[(\d+),(\d+),([A-Za-z]+),(\d+)\]/
        );

        return new Position({
            x: Number(x),
            y: Number(y),
            direction,
            straightSteps: Number(straightSteps),
        });
    }
}

const verticalLength = grid.length;
const horizontalLength = grid[0].length;

const result = dijkstra(
    grid,
    { x: 0, y: 0 },
    { x: horizontalLength - 1, y: verticalLength - 1 }
);

console.log(result.totalCost);
visualize(result, grid);

function dijkstra(grid, start, end) {
    const items = [
        new Position({
            x: start.x,
            y: start.y,
            direction: "right",
            priority: 0,
            stepsTaken: 0,
            straightSteps: 0,
        }),
        new Position({
            x: start.x,
            y: start.y,
            direction: "down",
            priority: 0,
            stepsTaken: 0,
            straightSteps: 0,
        }),
    ];

    const queue = new TinyQueue(items, (a, b) => a.priority - b.priority);

    const cameFrom = {};
    const costSoFar = {};
    items.forEach((i) => {
        cameFrom[i] = null;
        costSoFar[i] = 0;
    });

    while (queue.length) {
        const current = queue.pop();

        if (isPathEqual(current, end)) {
            break;
        }

        const nextStep = getNextCoordinates(current);
        const possiblePaths = getPossiblePaths(nextStep, current, grid);

        for (const neighbor of possiblePaths) {
            if (isPathEqual(neighbor, { x: 0, y: 0 })) {
                continue;
            }

            const newCost = costSoFar[current] + neighbor.priority;

            if (
                isUndefined(costSoFar[neighbor]) ||
                newCost < costSoFar[neighbor]
            ) {
                costSoFar[neighbor] = newCost;
                neighbor.setPriority(newCost);
                queue.push(neighbor);
                cameFrom[neighbor] = current;
            }
        }
    }

    const endPosition = Object.keys(costSoFar)
        .map((key) => Position.fromString(key))
        .filter((pos) => pos.x === end.x && pos.y === end.y)
        .sort((a, b) => a.priority - b.priority)[0];

    let pathCurrent = endPosition;
    const path = [];
    while (!isPathEqual(pathCurrent, start)) {
        path.push(pathCurrent);
        pathCurrent = cameFrom[pathCurrent];
    }

    path.push(start);

    return {
        path: path.reverse(),
        totalCost: costSoFar[endPosition],
    };
}

function isPathEqual(path1, path2) {
    return path1.x === path2.x && path1.y === path2.y;
}

function getCoordinateMap({ x, y }) {
    return [
        { position: { x, y: y + 1 }, direction: "down" },
        { position: { x: x + 1, y }, direction: "right" },
        { position: { x, y: y + -1 }, direction: "up" },
        { position: { x: x - 1, y }, direction: "left" },
    ];
}

function getPossiblePaths(newCoordinates, lastPosition, grid) {
    const { x, y } = newCoordinates;
    const {
        stepsTaken,
        direction,
        straightSteps,
        x: previousX,
        y: previousY,
    } = lastPosition;

    const allCoordinates = getCoordinateMap({ x, y });
    let validCoordinates = allCoordinates.filter((c) => {
        const sameAsPrevious =
            c.position.x === previousX && c.position.y === previousY;
        const isOutside = c.position.x < 0 || c.position.y < 0;
        const isWithinBounds =
            c.position.x <= horizontalLength - 1 &&
            c.position.y <= verticalLength - 1;

        return (
            !isOutside &&
            isWithinBounds &&
            !sameAsPrevious &&
            !lastPosition.hasVisitedPosition(c.position)
        );
    });

    let newStraightSteps;
    if (straightSteps >= 2) {
        validCoordinates = validCoordinates.filter(
            (c) => c.direction !== direction
        );
        newStraightSteps = 0;
    }

    return validCoordinates.map(({ direction: nextDirection }) => {
        const nextStraightSteps =
            nextDirection === direction ? straightSteps + 1 : 0;

        return new Position({
            x,
            y,
            direction: nextDirection,
            priority: grid[y][x],
            straightSteps: isDefined(newStraightSteps)
                ? newStraightSteps
                : nextStraightSteps,
            stepsTaken: stepsTaken + 1,
            previousPositions: [
                ...lastPosition.previousPositions,
                lastPosition,
            ],
        });
    });
}

function getNextCoordinates(position) {
    const { x, y } = position;
    const neighbors = getCoordinateMap({ x, y });
    return neighbors.find((n) => n.direction === position.direction).position;
}
