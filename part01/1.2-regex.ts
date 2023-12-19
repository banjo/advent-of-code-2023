import { FileKit } from "@banjoanton/node-utils";
import {
    Maybe,
    first,
    isDefined,
    isEmpty,
    last,
    sortBy,
} from "@banjoanton/utils";

const numberMap: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
};

const numberWords = Object.keys(numberMap);

type Match = {
    match: number;
    index: Maybe<number>;
};

main();

async function main() {
    const content = await getContent();
    const result = calculateSumFromContent(content);
    console.log(result);
}

async function getContent(): Promise<string> {
    const content = await FileKit.readFile("./input.txt");
    if (!isDefined(content)) {
        throw new Error("Content is not defined");
    }
    return content;
}

function calculateSumFromContent(content: string): number {
    let totalSum = 0;

    content.split("\n").forEach((line) => {
        let matchesForLine: Match[] = [];

        matchesForLine = matchesForLine.concat(
            findMatchesForLine(line, numberWords)
        );
        matchesForLine = matchesForLine.concat(findMatchesForLine(line, /\d/g));

        if (isEmpty(matchesForLine)) {
            return;
        }

        const sortedMatches = sortBy(matchesForLine, (match) => match.index);
        const combinedNumbers = combineFirstAndLastNumbers(sortedMatches);

        if (combinedNumbers !== null) {
            totalSum += combinedNumbers;
        }
    });

    return totalSum;
}

function findMatchesForLine(line: string, pattern: string[] | RegExp): Match[] {
    if (pattern instanceof RegExp) {
        return [...line.matchAll(pattern)].map((match) => ({
            index: match.index,
            match: getNumber(match[0]),
        }));
    }

    return pattern.flatMap((word) => {
        const regex = new RegExp(word, "g");
        const matches = [...line.matchAll(regex)];
        return matches.map((match) => ({
            index: match.index,
            match: getNumber(match[0]),
        }));
    });
}

function getNumber(value: string): number {
    const intValue = numberMap[value];
    return isDefined(intValue) ? intValue : parseInt(value, 10);
}

function combineFirstAndLastNumbers(sortedMatches: Match[]): number | null {
    const firstNumber = first(sortedMatches)?.match;
    const lastNumber = last(sortedMatches)?.match;
    return firstNumber && lastNumber
        ? Number(`${firstNumber}${lastNumber}`)
        : null;
}
