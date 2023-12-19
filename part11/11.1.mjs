import { isEmpty } from "@banjoanton/utils";
import fs from "fs";

const rows = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .filter((s) => !isEmpty(s))
    .map((s) => s.split(""));

const expanded = expand(rows);
const galaxies = getGalaxies(expanded);
const total = calculate(galaxies);

console.log(total);

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
    let total = 0;
    while (galaxies.length) {
        const galaxy = galaxies.shift();
        const { x, y } = galaxy;
        galaxies.forEach((g, i) => {
            const { x: x2, y: y2 } = g;
            const dist = Math.abs(x - x2) + Math.abs(y - y2);
            total += dist;
        });
    }

    return total;
}

function loop(array, handle, start = 0, innerStart = 0) {
    let pos = 0;
    for (let i = start; i < array.length; i++) {
        for (let j = innerStart; j <= array.length; j++) {
            const item = array[i][j];
            handle(item, i, j, pos);
            pos++;
        }
    }
}

function expand(rows) {
    let expandedX = [];
    for (const row of rows) {
        expandedX.push(row);

        if (row.every((p) => p === ".")) {
            expandedX.push(row);
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
            elements.forEach((e, i) => {
                if (expandedY[i] === undefined) {
                    expandedY[i] = [];
                }
                expandedY[i].push(e);
            });
        }
    }

    return expandedY;
}
