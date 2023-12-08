import { attempt, isDefined, isEmpty } from "@banjoanton/utils";
import fs from "fs";

const input = fs.readFileSync("./debug.txt", "utf-8").trim().split("\n\n");
const [seedString, ...mappers] = input;
const seedRanges = seedString
    .match(/\d+ \d+/g)
    .map((arr) => arr.split(" ").map(Number));
const final = seedRanges.map((seedRange) => {
    const [start, length] = seedRange;
    const end = start + length;

    console.log({ seedRange });
    let currentValues = [[start, end]];
    mappers.forEach((mapper) => {
        const mapperParts = mapper
            .split(":")[1]
            .split("\n")
            .filter((p) => !isEmpty(p))
            .map((p) => p.split(" "))
            .map((p) => p.map(Number));

        const schemas = mapperParts.flatMap((map) => {
            const [destinationStart, sourceStart, length] = map;
            const difference = destinationStart - sourceStart;
            const sourceEnd = sourceStart + length;
            return {
                sourceStart,
                sourceEnd,
                difference,
                transform: (arrays) => {
                    let updatedArr = [];
                    let affected = false;
                    for (const arr of arrays) {
                        const [start, end] = arr;
                        let parts = [];

                        // If 'start' is before 'sourceStart', then it's an outside part
                        if (start < sourceStart) {
                            parts.push({
                                start: start,
                                end: Math.min(end, sourceStart),
                                position: "before",
                            });
                        }

                        // If 'range1' overlaps with 'range2', add inside part
                        if (!(end < sourceStart || start > sourceEnd)) {
                            parts.push({
                                start: Math.max(start, sourceStart),
                                end: Math.min(end, sourceEnd),
                                position: "inside",
                            });

                            const beforePart = parts.find(
                                (p) => p.position === "before"
                            );
                            if (beforePart) {
                                beforePart.end = beforePart.end - 1;
                            }

                            affected = true;
                        }

                        // If 'end' is after 'sourceEnd', then it is also an outside part
                        if (end > sourceEnd) {
                            parts.push({
                                start: Math.max(sourceEnd, start),
                                end: end,
                                position: "after",
                            });

                            const insidePart = parts.find(
                                (p) => p.position === "inside"
                            );
                            if (insidePart) {
                                insidePart.end = insidePart.end - 1;
                            }
                        }

                        parts.forEach((part) => {
                            if (part.position === "inside") {
                                updatedArr.push({
                                    new: [
                                        part.start + difference,
                                        part.end + difference,
                                    ],
                                    old: [start, end],
                                    affected: true,
                                });
                            } else {
                                updatedArr.push({
                                    new: [part.start, part.end],
                                    old: [part.start, part.end],
                                    affected: false,
                                });
                            }
                        });
                    }

                    return { arrays: updatedArr, affected };
                },
            };
        });

        let appliedSchemaValues = [];
        let currentValuesMap = new Map(
            currentValues.map((c) => [`${c[0]}_${c[1]}`, c])
        );

        for (const schema of schemas) {
            if (currentValues.length === 0) break;

            // du ser buggen med den nuvarande breakpointen
            const { arrays: updatedValues, affected } =
                schema.transform(currentValues);

            if (!affected) continue;

            // Update the applied schema values and remove affected ones.
            updatedValues.forEach((updated) => {
                appliedSchemaValues.push(updated.new);
                const key = attempt(
                    () => `${updated.old[0]}_${updated.old[1]}`
                );

                if (isDefined(key) && currentValuesMap.has(key)) {
                    currentValuesMap.delete(key);
                }
            });

            // Rebuild the currentValues from the map entries
            currentValues = Array.from(currentValuesMap.values());
        }

        currentValues = currentValues.concat(appliedSchemaValues);
    });

    return currentValues;
});

let lowest = Number.MAX_SAFE_INTEGER;
final.forEach((arr) => {
    arr.forEach(([start, end]) => {
        const min = Math.min(start, end);
        lowest = Math.min(lowest, min);
    });
});

console.log(lowest);
