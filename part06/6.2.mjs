import { range } from "@banjoanton/utils";
import fs from "fs";

const [maxTime, distanceToBeat] = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .map((row) => {
        return Number(Array.from(row.matchAll(/\d+/g)).map(Number).join(""));
    });

let wins = 0;
range(maxTime).forEach((index) => {
    const number = index + 1;
    let timeLeft = maxTime - number;
    const msPerSecond = number;

    const totalDistance = timeLeft * msPerSecond;
    if (totalDistance > distanceToBeat) {
        wins++;
    }
});

console.log(wins);
