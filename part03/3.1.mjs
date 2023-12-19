import { isEmpty, uniq, uuid } from "@banjoanton/utils";
import fs from "fs";

const numberRegex = /\d+/g;

const rows = fs
    .readFileSync("./input.txt", "utf-8")
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => !isEmpty(s));

const specialCharacters = rows.reduce((acc, row) => {
    const chars = Array.from(row).filter((char) => {
        return char !== "." && !char.match(/\d/g);
    });

    return uniq([...acc, ...chars]);
}, []);

const specialRegex = new RegExp(
    `${specialCharacters.map((s) => `\\${s}`).join("|")}`,
    "g"
);

let allSpecialChars = [];
let allNumbers = [];
let index = -1;
for (const row of rows) {
    index++;

    const specialMatches = Array.from(row.matchAll(specialRegex));
    const specialsInRow = specialMatches.map((s) => {
        return {
            index: s.index,
            symbol: s[0],
            line: index + 1,
        };
    });

    if (specialsInRow.length) {
        allSpecialChars = allSpecialChars.concat(specialsInRow);
    }

    const matches = Array.from(row.matchAll(numberRegex));
    const numbersInRow = matches.map((m) => {
        const match = m[0];
        return {
            index: m.index,
            endIndex: m.index + match.length,
            match: Number(match),
            line: index + 1,
            id: uuid(),
        };
    });

    if (numbersInRow.length) {
        allNumbers = allNumbers.concat(numbersInRow);
    }
}

let savedNumbers = [];
const result = allSpecialChars.reduce((acc, special) => {
    const possibleIndexes = [
        special.index - 1,
        special.index,
        special.index + 1,
    ];
    const possibleLines = [special.line - 1, special.line, special.line + 1];

    const matchingNumbers = allNumbers.filter((n) => {
        const touchingIndexes = rangeArray(n.index, n.endIndex);

        const isMatchingIndex = touchingIndexes.some((i) =>
            possibleIndexes.includes(i)
        );
        const isCorrectLine = possibleLines.includes(n.line);
        const isSaved = savedNumbers.some((sn) => sn.id === n.id);

        return isMatchingIndex && isCorrectLine && !isSaved;
    });

    savedNumbers = savedNumbers.concat(matchingNumbers);

    return acc + matchingNumbers.reduce((acc, curr) => acc + curr.match, 0);
}, 0);

console.log(result);
function rangeArray(start, end) {
    var range = [];

    for (var i = start; i < end; i++) {
        range.push(i);
    }

    return range;
}
