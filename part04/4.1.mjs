import fs from "fs";

const input = fs.readFileSync("./input.txt", "utf-8").trim().split("\n");

const result = input.reduce((acc, row) => {
    const [winning, numbers] = row
        .split(":")[1]
        .split("|")
        .map((r) =>
            Array.from(r.matchAll(/\d+/g)).map((match) => Number(match[0]))
        );

    const matches = numbers.reduce(
        (acc, number) => (winning.includes(number) ? acc + 1 : acc),
        0
    );

    if (matches === 0) return acc;
    if (matches === 1) return acc + 1;

    let score = 1;
    for (let index = 0; index < matches - 1; index++) {
        score *= 2;
    }

    return acc + score;
}, 0);

console.log(result);
