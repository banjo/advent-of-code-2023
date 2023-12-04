import { isDefined, isEmpty } from "@banjoanton/utils";
import fs from "fs";

const rows = fs
    .readFileSync("./input.txt", "utf-8")
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => !isEmpty(s));

let result = 0;
rows.forEach((row, index) => {
    const digits = Array.from(row.matchAll(/\d+/g)).map((d) => ({
        value: Number(d[0]),
        indexes: rangeArray(d.index, d.index + d[0].length),
    }));

    const affectedRows = [row, rows[index - 1], rows[index + 1]].filter(
        isDefined
    );

    const rowResult = digits.reduce((acc, digit) => {
        const isActive = affectedRows.some((row) => {
            const chars = Array.from(row);

            const hasMatch = digit.indexes.some((index) => {
                const symbols = [
                    chars[index],
                    chars[index - 1],
                    chars[index + 1],
                ].filter(isDefined);

                const includesSpecialChar = symbols.some((symbol) => {
                    const isNumber = /\d/g.test(symbol);
                    const isDot = symbol === ".";

                    return !isNumber && !isDot;
                });

                return includesSpecialChar;
            });

            return hasMatch;
        });

        return isActive ? acc + digit.value : acc;
    }, 0);

    result += rowResult;
});

console.log(result);

function rangeArray(start, end) {
    var range = [];

    for (var i = start; i < end; i++) {
        range.push(i);
    }

    return range;
}
