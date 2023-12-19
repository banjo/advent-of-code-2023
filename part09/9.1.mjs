import { isEmpty, last } from "@banjoanton/utils";
import fs from "fs";

const input = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .filter((s) => !isEmpty(s));

const total = input.reduce((acc, row) => {
    const digits = row.split(" ").map(Number);
    const extrapolated = recurse(digits);
    const added = add(extrapolated);
    return acc + last(last(added));
}, 0);

console.log(total);

function add(numbers) {
    const reversed = numbers.toReversed();

    let toAdd = 0;
    for (let index = 0; index < reversed.length; index++) {
        const list = reversed[index];

        const lastIndex = list.length - 1;
        const last = list[lastIndex];

        toAdd = last + toAdd;
        list.push(toAdd);
    }

    return reversed;
}

function recurse(numbers, arrays = [numbers]) {
    if (numbers.every((number) => number === 0)) {
        return arrays;
    }

    let extrapolated = [];
    for (let index = 1; index < numbers.length; index++) {
        const previous = numbers[index - 1];
        const current = numbers[index];
        extrapolated.push(current - previous);
    }

    arrays.push(extrapolated);
    return recurse(extrapolated, arrays);
}
