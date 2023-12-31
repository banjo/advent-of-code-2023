import fs from "fs";

const hexMap = {
    0: "R",
    1: "D",
    2: "L",
    3: "U",
};

const digPlan = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .map((row) => {
        const [, , , hex] = row.match(/([A-Z]) (\d+) (\(.*\))/);
        const slicedHex = hex.slice(2, hex.length - 1);

        const digLength = parseHex(slicedHex.slice(0, slicedHex.length - 1));
        const digDirection = hexMap[slicedHex.slice(-1)];

        return {
            direction: digDirection,
            length: Number(digLength),
        };
    });

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const directionMap = (amount) => {
    return {
        U: ({ x, y }) => new Point(x, y - amount),
        D: ({ x, y }) => new Point(x, y + amount),
        L: ({ x, y }) => new Point(x - amount, y),
        R: ({ x, y }) => new Point(x + amount, y),
    };
};

const result = getPointArray(digPlan);
const area = shoelace(result.points);
const inside = picks(area, result.totalLength);
console.log(inside + result.totalLength);

// picks theorem
function picks(area, points) {
    return Math.abs(area) - 0.5 * points + 1;
}

// shoelace formula
function shoelace(points) {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
        let j = (i + 1) % points.length; // next vertex
        area += points[i].x * points[j].y;
        area -= points[i].y * points[j].x;
    }
    return Math.abs(area) / 2;
}

function parseHex(hex) {
    return parseInt(hex, 16);
}

function getPointArray() {
    const startPoint = new Point(0, 0);
    let points = [startPoint];

    let totalLength = 0;

    let minY = Infinity;
    let minX = Infinity;
    let previousPoint = startPoint;
    for (const entry of digPlan) {
        const { direction, length } = entry;
        const createPoint = directionMap(length)[direction];

        totalLength += length;
        const newPoint = createPoint(previousPoint);
        minY = Math.min(newPoint.y, minY);
        minX = Math.min(newPoint.x, minX);

        if (!points.some((point) => isPathEqual(point, newPoint))) {
            points.push(newPoint);
            previousPoint = newPoint;
        }
    }

    if (minY < 0 || minX < 0) {
        points = points.map(
            (point) =>
                new Point(point.x + Math.abs(minX), point.y + Math.abs(minY))
        );
    }

    return { points, totalLength };
}

function isPathEqual(path1, path2) {
    return path1.x === path2.x && path1.y === path2.y;
}
