import { isEmpty } from "@banjoanton/utils";
import lcm from "compute-lcm";
import fs from "fs";

const input = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .filter((s) => !isEmpty(s));

const [instructions, ...locations] = input;

const connections = {};
locations.forEach((location) => {
    const [full, start, left, right] = location.match(
        /(\w+) = \((\w+), (\w+)\)/
    );
    connections[start] = { L: left, R: right };
});

const starts = Object.keys(connections).filter((location) =>
    location.endsWith("A")
);

const steps = starts.map((start) => {
    return getSteps(start);
});

console.log(lcm(steps));

function getSteps(location) {
    let current = location;

    let index = -1;
    while (current[2] !== "Z") {
        index++;
        const instruction = instructions[index % instructions.length];
        current = connections[current][instruction];
    }

    return index + 1;
}
