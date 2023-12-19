import fs from "fs";

const input = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .map((r) => r.split(" "))
    .map(([hand, bid]) => [hand, Number(bid)]);

const hands = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    T: 10,
    J: 11,
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
    return hand.split("").every((c) => c === hand[0]);
};

const isFourAKind = (hand) => {
    return Object.values(getCharMap(hand)).some((v) => v === 4);
};

const isFullHouse = (hand) => {
    const chars = getCharMap(hand);
    const values = Object.values(chars);
    return values.length === 2 && values.some((v) => v === 3);
};

const isThreeOfAKind = (hand) => {
    return Object.values(getCharMap(hand)).some((v) => v === 3);
};

const isTwoPair = (hand) => {
    const chars = getCharMap(hand);
    const values = Object.values(chars);
    return (
        values.some((v) => v === 1) &&
        values.some((v) => v === 2) &&
        values.length === 3
    );
};

const isOnePair = (hand) => {
    return Object.values(getCharMap(hand)).some((v) => v === 2);
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
    } else {
        return score.highCard;
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

const ranked = updatedInput.sort(compareHands);

const totalScore = ranked.reduce((acc, hand, idx) => {
    const rank = ranked.length - idx;
    return acc + hand.bid * rank;
}, 0);

console.log(totalScore);
