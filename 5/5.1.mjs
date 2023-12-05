import { isEmpty } from "@banjoanton/utils";
import fs from "fs";

const input = fs.readFileSync("./input.txt", "utf-8").trim().split("\n\n");
const [seedString, ...mappers] = input;
const seeds = seedString.match(/\d+/g).map(Number);

const final = seeds.map((seed) => {
    let currentSeedValue = seed;
    mappers.forEach((mapper) => {
        const parts = mapper
            .split(":")[1]
            .split("\n")
            .filter((p) => !isEmpty(p))
            .map((p) => p.split(" "))
            .map((p) => p.map(Number));

        for (const part of parts) {
            const [destinationStart, sourceStart, length] = part;
            const hasMapper = isBetween(
                currentSeedValue,
                sourceStart,
                sourceStart + length
            );
            if (hasMapper) {
                const difference = currentSeedValue - sourceStart;
                currentSeedValue = destinationStart + difference;
                break;
            }
        }
    });

    return currentSeedValue;
});

console.log(Math.min(...final));

function isBetween(number, min, max) {
    return number >= min && number < max;
}
