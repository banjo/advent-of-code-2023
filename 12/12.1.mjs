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
    total += getArrangements(schema, order);
}

console.log(total);

function getArrangements(schema, order) {
    const length = Array.from(schema.match(/\?/g)).length;
    const maxNumber = Math.pow(2, length);
    let arrangements = 0;

    for (let i = 0; i < maxNumber; i++) {
        const combination = getCombination(i, length);
        const possibleSchema = replaceSchema(schema, combination);
        const schemaOrder = getOrderFromSchema(possibleSchema);

        if (isEqual(order, schemaOrder)) {
            arrangements++;
        }
    }

    return arrangements;
}

function getCombination(index, length) {
    const binary = index.toString(2).padStart(length, "0");
    return binary.replaceAll("0", "#").replaceAll("1", ".");
}

function replaceSchema(schema, combination) {
    let newWord = [];
    let combinationIndex = 0;
    for (const char of schema) {
        if (char === "?") {
            newWord.push(combination[combinationIndex]);
            combinationIndex++;
        } else {
            newWord.push(char);
        }
    }

    return newWord.join("");
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
