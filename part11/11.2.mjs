import { isEmpty } from "@banjoanton/utils";
import fs from "fs";

const rows = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .filter((s) => !isEmpty(s))
    .map((s) => s.split(""));

const galaxies = getGalaxies(rows);
const distances = calculate(galaxies);

const expanded = expand(rows);
const expandedGalaxies = getGalaxies(expanded);
const expandedDistances = calculate(expandedGalaxies);
const difference = getDifference(distances, expandedDistances);
const total = differenceWithMultiplier(difference, distances, 1000000);

console.log(total);

function differenceWithMultiplier(difference, distances, multiplier) {
    let loops = multiplier - 1;

    return difference.reduce((acc, difference, i) => {
        const val = difference * loops + distances[i].distance;
        return acc + val;
    }, 0);
}

function getDifference(distances, expandedDistances) {
    return distances.map((d, i) => expandedDistances[i].distance - d.distance);
}

function getGalaxies(grid) {
    let galaxies = [];
    loop(grid, (item, i, j, pos) => {
        if (item === "#") {
            galaxies.push({ item, x: i, y: j, pos });
        }
    });

    return galaxies;
}

function calculate(galaxies) {
    const arr = structuredClone(galaxies);
    let distances = [];
    while (arr.length) {
        const galaxy = arr.shift();
        const { x, y } = galaxy;
        arr.forEach((g, i) => {
            const { x: x2, y: y2 } = g;
            const dist = Math.abs(x - x2) + Math.abs(y - y2);
            distances.push({ first: galaxy, second: g, distance: dist });
        });
    }

    return distances;
}

function loop(array, handle) {
    const arr = structuredClone(array);
    let pos = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j <= arr.length; j++) {
            const item = arr[i][j];
            handle(item, i, j, pos);
            pos++;
        }
    }
}

function expand(rows, loops = 1) {
    let expandedX = [];
    for (const row of rows) {
        expandedX.push(row);

        if (row.every((p) => p === ".")) {
            for (let i = 0; i < loops; i++) {
                expandedX.push(row);
            }
        }
    }

    let expandedY = [];
    let i = -1;
    while (true) {
        i++;
        let shouldBreak = false;

        let elements = [];
        for (let j = 0; j < expandedX.length; j++) {
            const element = expandedX[j][i];

            if (element === undefined) {
                shouldBreak = true;
                break;
            }

            elements.push(element);
        }

        if (shouldBreak) {
            break;
        }

        elements.forEach((e, i) => {
            if (expandedY[i] === undefined) {
                expandedY[i] = [];
            }
            expandedY[i].push(e);
        });

        if (elements.every((e) => e === ".")) {
            for (let i = 0; i < loops; i++) {
                elements.forEach((e, i) => {
                    if (expandedY[i] === undefined) {
                        expandedY[i] = [];
                    }
                    expandedY[i].push(e);
                });
            }
        }
    }

    return expandedY;
}
