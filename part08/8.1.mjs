import { isEmpty } from "@banjoanton/utils";
import fs from "fs";

const input = fs
    .readFileSync("./example.txt", "utf-8")
    .trim()
    .split("\n")
    .filter((s) => !isEmpty(s));

const [instructions, ...locations] = input;
const regex = /\((\w+), (\w+)\)/;

const goal = "ZZZ";
let current = "AAA";

const connections = {};
locations.forEach((location) => {
    const [full, left, right] = location.match(regex);
    connections[getValue(location)] = { left, right };
});

const memo = {};
const getNextLocation = (location, instruction) => {
    if (memo[location + instruction]) {
        return memo[location + instruction];
    }
    const { left, right } = connections[location];
    const next = instruction === "L" ? left : right;
    memo[location + instruction] = next;
    return next;
};

let index = -1;
while (true) {
    index++;
    let nextItem = index % instructions.length;

    const instruction = instructions[nextItem];
    const next = getNextLocation(current, instruction);

    if (next === goal) {
        console.log(`Done: ${index + 1}`);
        process.exit(0);
    }

    current = next;
}

function getValue(location) {
    return location.slice(0, 3);
}
