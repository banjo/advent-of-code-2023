import { uniq } from "@banjoanton/utils";
import fs from "fs";

const input = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .map((r) => r.split(" "))
    .map(([hand, bid]) => [hand, Number(bid)]);

const hands = {
    J: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    T: 10,
    Q: 12,
    K: 13,
    A: 14,
};

const score = {
    fiveAKind: 7,
    fourAKind: 6,
    fullHouse: 5,
    threeOfAKind: 4,
    twoPair: 3,
    onePair: 2,
    highCard: 1,
};

const getCharMap = (hand) => {
    const chars = {};
    hand.split("").forEach((c) => (chars[c] = (chars[c] ?? 0) + 1));
    return chars;
};

const isFiveAKind = (hand) => {
    const jokers = hand.split("").filter((c) => c === "J").length;
    if (jokers === 5) return true;

    return Object.values(getCharMap(hand)).some(
        (value) => value + jokers === 5
    );
};

const isFourAKind = (hand) => {
    const jokers = hand.split("").filter((c) => c === "J").length;
    if (jokers >= 4) return true;

    return Object.entries(getCharMap(hand))
        .filter(([card, value]) => card !== "J")
        .some(([card, value]) => value + jokers >= 4);
};

const isFullHouse = (hand) => {
    const jokers = hand.split("").filter((c) => c === "J").length;
    const chars = getCharMap(hand);
    const values = Object.entries(chars).filter(
        ([card, value]) => card !== "J"
    );

    if (jokers === 0) {
        return (
            values.some(([_, value]) => value === 3) &&
            values.some(([_, value]) => value === 2)
        );
    }

    if (jokers === 1) {
        return values.length === 2;
    }

    if (jokers === 2) {
        return values.length <= 2;
    }

    if (jokers >= 3) return true;

    return false;
};

const isThreeOfAKind = (hand) => {
    const jokers = hand.split("").filter((c) => c === "J").length;
    if (jokers >= 3) return true;
    const values = Object.values(getCharMap(hand));

    if (jokers === 0) {
        return values.some((v) => v === 3);
    }

    if (jokers === 1) {
        return values.some((v) => v >= 2);
    }

    if (jokers === 2) {
        return values.some((v) => v >= 1);
    }

    return false;
};

const isTwoPair = (hand) => {
    const jokers = hand.split("").filter((c) => c === "J").length;
    if (jokers >= 2) return true;

    const chars = getCharMap(hand);
    const values = Object.values(chars);

    if (jokers === 0) {
        return (
            values.some((v) => v === 1) &&
            values.some((v) => v === 2) &&
            values.length === 3
        );
    }

    if (jokers === 1) {
        return values.some((v) => v >= 2);
    }

    return false;
};

const isOnePair = (hand) => {
    const jokers = hand.split("").filter((c) => c === "J").length;
    if (jokers >= 1) return true;

    return Object.values(getCharMap(hand)).some((v) => v === 2);
};

const isHighCard = (hand) => {
    return uniq(hand.split("")).length === 5;
};

const getScore = (hand) => {
    if (isFiveAKind(hand)) {
        return score.fiveAKind;
    } else if (isFourAKind(hand)) {
        return score.fourAKind;
    } else if (isFullHouse(hand)) {
        return score.fullHouse;
    } else if (isThreeOfAKind(hand)) {
        return score.threeOfAKind;
    } else if (isTwoPair(hand)) {
        return score.twoPair;
    } else if (isOnePair(hand)) {
        return score.onePair;
    } else if (isHighCard(hand)) {
        return score.highCard;
    } else {
        return 0;
    }
};

const getCardScores = (hand) => {
    return hand.split("").map((card) => hands[card]);
};

const compareHands = (hand1, hand2) => {
    if (hand1.score !== hand2.score) {
        return hand2.score - hand1.score;
    }

    for (let i = 0; i < hand1.cardScores.length; i++) {
        if (hand1.cardScores[i] !== hand2.cardScores[i]) {
            return hand2.cardScores[i] - hand1.cardScores[i];
        }
    }
    return 0;
};

const updatedInput = input.map(([hand, bid]) => {
    return {
        hand,
        bid,
        score: getScore(hand),
        cardScores: getCardScores(hand),
    };
});

const ranked = updatedInput.sort(compareHands).reverse();

const totalScore = ranked.reduce((acc, hand, idx) => {
    const rank = idx + 1;
    return acc + hand.bid * rank;
}, 0);

console.log(totalScore);
