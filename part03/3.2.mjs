import { isDefined, isEmpty, uniq } from "@banjoanton/utils";
import fs from "fs";

const rows = fs
    .readFileSync("./input.txt", "utf-8")
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => !isEmpty(s));

const specialChars = rows.reduce((acc, row) => {
    const chars = Array.from(row).filter((char) => {
        return char !== "." && !char.match(/\d/g);
    });

    return uniq([...acc, ...chars]);
}, []);

const regex = new RegExp(`${specialChars.map((s) => `\\${s}`).join("|")}`, "g");

let result = 0;
rows.forEach((row, index) => {
    const rowChars = Array.from(row.matchAll(regex)).map((d) => ({
        value: d[0],
        index: d.index,
    }));

    if (isEmpty(rowChars)) return;

    const affectedRows = [rows[index - 1], row, rows[index + 1]].filter(
        isDefined
    );

    let valueForRow = 0;
    rowChars.forEach((char) => {
        const possibleIndexes = [
            char.index - 1,
            char.index,
            char.index + 1,
        ].filter(isDefined);

        let matchingDigitsForChar = [];
        affectedRows.forEach((affectedRow) => {
            const rowDigits = Array.from(affectedRow.matchAll(/\d+/g)).map(
                (d) => ({
                    value: Number(d),
                    indexes: rangeArray(d.index, d.index + d[0].length),
                })
            );

            const matches = rowDigits.filter((digit) => {
                return digit.indexes.some((d) => possibleIndexes.includes(d));
            });

            matchingDigitsForChar = matchingDigitsForChar.concat(matches);
        });

        if (matchingDigitsForChar.length < 2) {
            return;
        }

        const valueForChar = matchingDigitsForChar.reduce(
            (acc, curr) => acc * curr.value,
            1
        );

        valueForRow += valueForChar;
    });

    result += valueForRow;
});

console.log(result);

function rangeArray(start, end) {
    var range = [];

    for (var i = start; i < end; i++) {
        range.push(i);
    }

    return range;
}
