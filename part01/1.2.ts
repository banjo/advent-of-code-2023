import { FileKit } from "@banjoanton/node-utils";
import { Maybe, first, isDefined, isEmpty } from "@banjoanton/utils";

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

main();

class PossibleAnswers {
    possibleAnswers: string[];

    constructor() {
        this.possibleAnswers = [];
    }

    addChar(char: string) {
        this.possibleAnswers = this.possibleAnswers.map((str) => {
            return str + char;
        });
        this.possibleAnswers.push(char);
    }

    reset() {
        this.possibleAnswers = [];
    }

    filter(fn: (str: string) => boolean) {
        this.possibleAnswers = this.possibleAnswers.filter(fn);
        return this.possibleAnswers;
    }

    isEmpty() {
        return this.possibleAnswers.length === 0;
    }

    get() {
        return structuredClone(this.possibleAnswers);
    }

    get length() {
        return this.possibleAnswers.length;
    }
}

async function main() {
    const content = await getContent();

    let result = 0;
    content.split("\n").forEach((line) => {
        let firstNumber: Maybe<number> = undefined;
        let lastNumber: Maybe<number> = undefined;
        const possibleAnswers = new PossibleAnswers();

        let index = -1;
        for (const char of line) {
            index++;
            if (isNumber(char)) {
                possibleAnswers.reset();

                if (!isDefined(firstNumber)) {
                    firstNumber = Number(char);
                    lastNumber = Number(char);
                    continue;
                }

                lastNumber = Number(char);
                continue;
            }

            possibleAnswers.addChar(char);
            possibleAnswers.filter(isPartOfNumber);

            if (possibleAnswers.isEmpty()) {
                continue;
            }

            const answers = possibleAnswers.get().filter(isNumberString);

            // if a new word has started that is later but the first one is complete: oneight -> 8
            if (
                !isEmpty(answers) &&
                answers.length !== possibleAnswers.length
            ) {
                let nonCompleteAnswers = possibleAnswers.filter(
                    (str) => !isNumberString(str)
                );
                let hasFutureValue = false;

                // check if the latest one can be completed.
                const restOfCurrentWord = line.slice(index + 1);
                for (const c of restOfCurrentWord) {
                    nonCompleteAnswers = nonCompleteAnswers.map((a) => a + c);

                    hasFutureValue = nonCompleteAnswers.some((a) =>
                        isNumberString(a)
                    );

                    if (hasFutureValue) {
                        break;
                    }
                }

                if (hasFutureValue && !isDefined(firstNumber)) {
                    const answer = answers.find(isNumberString);

                    if (!isDefined(answer)) {
                        throw new Error("Answer is not defined");
                    }

                    firstNumber = getNumber(answer);
                    lastNumber = getNumber(answer);
                    possibleAnswers.filter((v) => !isNumberString(v));
                    continue;
                }

                if (hasFutureValue) {
                    possibleAnswers.filter((v) => !isNumberString(v));
                    continue;
                }
            }

            const longestAnswers = [...answers].sort(
                (a, b) => b.length - a.length
            );

            const longestAnswer = first(longestAnswers);
            if (isDefined(longestAnswer)) {
                const number = getNumber(longestAnswer);

                if (!isDefined(firstNumber)) {
                    possibleAnswers.reset();
                    firstNumber = number;
                    lastNumber = number;
                    continue;
                }

                possibleAnswers.reset();
                lastNumber = number;
            }
        }

        if (firstNumber && lastNumber) {
            result += Number(`${firstNumber}${lastNumber}`);
        }
    });

    console.log(result);
}

function isNumber(str: string) {
    const int = Number.parseInt(str);
    return !Number.isNaN(int);
}

async function getContent() {
    const content = await FileKit.readFile("./input.txt");

    if (!isDefined(content)) {
        throw new Error("Content is not defined");
    }

    return content;
}

function getNumber(str: string) {
    const int = numberMap[str];

    if (!isDefined(int)) {
        throw new Error(`Not a valid number: ${int}`);
    }

    return int;
}

function isPartOfNumber(str: string) {
    return Object.keys(numberMap).some((numberAsString) =>
        numberAsString.startsWith(str)
    );
}

function isNumberString(str: string) {
    return Object.keys(numberMap).some(
        (numberAsString) => str === numberAsString
    );
}
