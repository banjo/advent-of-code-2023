import fs from "fs";

const digPlan = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .map((row) => {
        const [, direction, length, hex] = row.match(/([A-Z]) (\d+) (\(.*\))/);
        return {
            direction,
            length: Number(length),
            hex: hex.slice(1, hex.length - 1),
        };
    });

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const directionMap = {
    U: ({ x, y }) => new Point(x, y - 1),
    D: ({ x, y }) => new Point(x, y + 1),
    L: ({ x, y }) => new Point(x - 1, y),
    R: ({ x, y }) => new Point(x + 1, y),
};

const result = getPointArray();
const area = shoelace(result.points);
const inside = picks(area, result.points);
console.log(inside + result.points.length);

// picks theorem
function picks(area, points) {
    // int(abs(area) - 0.5 * len(points) + 1);
    return Math.abs(area) - 0.5 * points.length + 1;
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

function getPointArray() {
    const startPoint = new Point(0, 0);
    let points = [startPoint];

    let previousPoint = startPoint;
    let minY = Infinity;
    let minX = Infinity;
    let maxY = 0;
    let maxX = 0;
    for (const entry of digPlan) {
        const { direction, length } = entry;
        const createPoint = directionMap[direction];

        for (let i = 0; i < length; i++) {
            const newPoint = createPoint(previousPoint);

            minY = Math.min(newPoint.y, minY);
            minX = Math.min(newPoint.x, minX);
            maxY = Math.max(newPoint.y, maxY);
            maxX = Math.max(newPoint.x, maxX);

            if (!points.some((point) => isPathEqual(point, newPoint))) {
                points.push(newPoint);
                previousPoint = newPoint;
            }
        }
    }

    if (minY < 0 || minX < 0) {
        points = points.map(
            (point) =>
                new Point(point.x + Math.abs(minX), point.y + Math.abs(minY))
        );
        maxY += Math.abs(minY);
        maxX + Math.abs(minX);
    }

    return { points, maxX, maxY };
}

function isPathEqual(path1, path2) {
    return path1.x === path2.x && path1.y === path2.y;
}
