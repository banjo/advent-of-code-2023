import fs from "fs";

const words = fs.readFileSync("./input.txt", "utf-8").split(",");

const total = words.reduce((acc, word) => {
    return acc + hash(word);
}, 0);

console.log(total);

function hash(word) {
    let currentValue = 0;

    word.split("").forEach((char) => {
        const ascii = char.charCodeAt(0);
        currentValue += ascii;
        currentValue *= 17;
        currentValue = currentValue % 256;
    });

    return currentValue;
}
