import { FileKit } from "@banjoanton/node-utils";
import { first, isDefined, last } from "@banjoanton/utils";

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

const regex = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g;

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
    const lines = content.split("\n");

    let totalSum = 0;
    lines.forEach((line) => {
        const matches = Array.from(line.matchAll(regex))
            .map((match) => match[1])
            .map(toNumber);

        const firstNumber = first(matches);
        const lastNumber = last(matches);

        if (firstNumber && lastNumber) {
            totalSum += Number(`${first(matches)}${last(matches)}`);
        }
    });

    return totalSum;
}

function toNumber(value: string): number {
    const intValue = numberMap[value];
    return isDefined(intValue) ? intValue : parseInt(value, 10);
}
