import { isEmpty } from "@banjoanton/utils";
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

let current = "AAA";
const goal = "ZZZ";

let index = -1;
while (current !== goal) {
    index++;
    const instruction = instructions[index % instructions.length];
    current = connections[current][instruction];
}

console.log(index + 1);
