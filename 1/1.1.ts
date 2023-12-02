import { FileKit } from "@banjoanton/node-utils";
import { Maybe, isDefined } from "@banjoanton/utils";

main();

async function main() {
    const content = await getContent();

    let result = 0;
    content.split("\n").forEach((line) => {
        let firstNumber: Maybe<number> = undefined;
        let lastNumber: Maybe<number> = undefined;

        for (const char of line) {
            if (!isNumber(char)) {
                continue;
            }

            if (!isDefined(firstNumber)) {
                firstNumber = Number(char);
                lastNumber = Number(char);
                continue;
            }

            lastNumber = Number(char);
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
