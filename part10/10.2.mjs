import { attempt, first, isDefined, isEmpty, isEqual } from "@banjoanton/utils";
import fs from "fs";

const input = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .filter((s) => !isEmpty(s))
    .map((s) => s.split(""));

const pipeMap = {
    "|": ["up", "down"],
    "-": ["left", "right"],
    L: ["up", "right"],
    J: ["up", "left"],
    7: ["left", "down"],
    F: ["right", "down"],
    ".": [],
    S: undefined,
};

const directionIndexMap = ["down", "left", "up", "right"];

let startIndex;
for (let i = 0; i < input.length; i++) {
    if (startIndex !== undefined) {
        break;
    }

    for (let j = 0; j < input.length; j++) {
        const pipe = input[i][j];
        if (pipe === "S") {
            startIndex = [i, j];
            break;
        }
    }
}

let currentBlocks = [first(getNextBlocksFromS(startIndex))];
let visited = [startIndex, ...currentBlocks.map((c) => c.index)];
while (true) {
    if (
        currentBlocks.some((b) => {
            return visited.some((visited) => {
                return isEqual(visited, b.next);
            });
        })
    ) {
        getArea(visited);
        process.exit(0);
    }

    currentBlocks = currentBlocks.map((current) => {
        const newBlock = getNextBlocks(current);

        if (!newBlock) {
            getArea(visited);
            process.exit(0);
        }

        visited.push(newBlock.index);
        return newBlock;
    });
}

function getArea(visited) {
    const area = shoelace(visited);
    const points = picks(area, visited.length);
    console.log(points);
}

// picks theorem
function picks(area, points) {
    return Math.abs(area) - 0.5 * points + 1;
}

// shoelace formula
function shoelace(points) {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
        let j = (i + 1) % points.length; // next vertex
        area += points[i][0] * points[j][1];
        area -= points[i][1] * points[j][0];
    }
    return Math.abs(area) / 2;
}

function getNextBlocks(block) {
    const openings = pipeMap[block.pipe];
    const pipes = openings
        .map((opening) => {
            const next = nextPipe(block.index, opening);
            const nextBlock = getBlockByIndex(next);
            if (visited.some((v) => isEqual(v, nextBlock.index))) {
                return undefined;
            }
            return nextBlock;
        })
        .filter(isDefined);

    return pipes[0];
}

function getNextBlocksFromS(index) {
    const newPositions = [
        nextPipe(index, "up"),
        nextPipe(index, "right"),
        nextPipe(index, "down"),
        nextPipe(index, "left"),
    ];

    const pipes = newPositions.map((pos) => getBlockByIndex(pos));

    const pipesConnectedToMiddle = pipes.reduce((acc, pipe, index) => {
        const directions = pipeMap[pipe.pipe];

        if (!isDefined(directions)) {
            return acc;
        }
        const connectedPipe = directions.find(
            (d) => d === directionIndexMap[index]
        );

        if (!connectedPipe) return acc;

        const nextDirection = directions.find((d) => d !== connectedPipe);

        return [
            ...acc,
            {
                ...pipe,
                next: nextPipe(pipe.index, nextDirection),
            },
        ];
    }, []);

    return pipesConnectedToMiddle;
}

function getBlockByIndex(index) {
    const [i, j] = index;
    const pipe = attempt(() => input[i][j], { fallbackValue: null });

    return {
        pipe,
        index,
    };
}

function nextPipe(index, direction) {
    const [i, j] = index;

    if (direction === "up") {
        return [i - 1, j];
    } else if (direction === "right") {
        return [i, j + 1];
    } else if (direction === "down") {
        return [i + 1, j];
    } else if (direction === "left") {
        return [i, j - 1];
    }
}
