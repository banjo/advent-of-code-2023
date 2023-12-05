import { range } from "@banjoanton/utils";
import fs from "fs";

const input = fs.readFileSync("./input.txt", "utf-8").trim().split("\n");

const cards = {};
input.forEach((row, index) => {
    const cardNumber = index + 1;
    addCardToPile(cardNumber);
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

    if (matches === 0) return;

    const winningCards = cards[cardNumber];

    range(winningCards).forEach(() => {
        range(matches).forEach((idx) => {
            const newCardNumber = cardNumber + idx + 1;
            addCardToPile(newCardNumber);
        });
    });
});

const result = Object.values(cards).reduce((acc, value) => acc + value, 0);
console.log(result);

function addCardToPile(number) {
    cards[number] = (cards[number] ?? 0) + 1;
}
