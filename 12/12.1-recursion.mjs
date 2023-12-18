import { first, isEmpty, isEqual, last } from "@banjoanton/utils";
import fs from "fs";

const rows = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .filter((s) => !isEmpty(s))
    .map((s) => s.split(" "));

let total = 0;
for (const [schema, orderString] of rows) {
    const order = orderToArray(orderString);
    const arrangements = solve(schema, order);
    total += arrangements;
}

console.log(total);

function solve(schema, order) {
    if (!schema.includes("?")) {
        return isValid(schema, order) ? 1 : 0;
    }

    const first = schema.replace("?", "#");
    const second = schema.replace("?", ".");

    return solve(first, order) + solve(second, order);
}

function isValid(schema, order) {
    return isEqual(getOrderFromSchema(schema), order);
}

function orderToArray(orderString) {
    return orderString.split(",").map(Number);
}

function getOrderFromSchema(str) {
    let previous = first(str);
    const isBroken = (str) => str === ".";

    const res = [];
    let amount = isBroken(previous) ? 0 : 1;
    for (const char of str.slice(1)) {
        if (char === previous && isBroken(char)) continue;

        if (isBroken(char)) {
            res.push(amount);
            amount = 0;
        } else {
            amount++;
        }

        previous = char;
    }

    if (last(str) === "#") {
        res.push(amount);
    }

    return res;
}
