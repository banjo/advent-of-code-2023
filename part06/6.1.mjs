import { range } from "@banjoanton/utils";
import fs from "fs";

const [timeArray, distanceArray] = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .map((row) => {
        return Array.from(row.matchAll(/\d+/g)).map(Number);
    });

const winsPerRace = [];
for (let index = 0; index < timeArray.length; index++) {
    const maxTime = timeArray[index];
    const distanceToBeat = distanceArray[index];

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

    if (wins > 0) {
        winsPerRace.push(wins);
    }
}

const result = winsPerRace.reduce((acc, current) => acc * current, 1);
console.log(result);
