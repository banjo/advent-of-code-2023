import { first, isEmpty, memoize, produce } from "@banjoanton/utils";
import fs from "fs";

const rows = fs
    .readFileSync("./input.txt", "utf-8")
    .trim()
    .split("\n")
    .filter((s) => !isEmpty(s))
    .map((s) => s.split(" "))
    .map(([schema, order]) => {
        const updatedSchema = new Array(5).fill(schema).join("?");
        const updatedOrder = new Array(5).fill(order).join(",");
        return [updatedSchema, updatedOrder];
    });

const memoizedSolve = memoize(solve);

let total = 0;
for (const [schema, orderString] of rows) {
    const order = orderToArray(orderString);
    const arrangements = memoizedSolve(schema, order);
    total += arrangements;
}

console.log(total);

function solve(schema, order) {
    if (isEmpty(schema) && isEmpty(order)) {
        return 1;
    }

    if (isEmpty(order) && !schema.split("").some((v) => v === "#")) {
        return 1;
    }

    const firstChar = schema[0];

    switch (firstChar) {
        case ".": {
            return memoizedSolve(schema.slice(1), order);
        }
        case "?": {
            const restOfSchema = schema.slice(1);
            const first = "." + restOfSchema;
            const firstAmount = memoizedSolve(first, order);

            const second = "#" + restOfSchema;
            const secondAmount = memoizedSolve(second, order);
            return firstAmount + secondAmount;
        }
        case "#": {
            const orderLength = first(order);
            const hasLongEnoughSchema = schema.length >= orderLength;
            const sliceIncludesDots = schema
                .slice(0, orderLength)
                .includes(".");
            const isAtEndOfSchema = schema.length === orderLength;
            const endsWithHash = schema[orderLength] === "#";

            const shouldContinue = isAtEndOfSchema || !endsWithHash;

            if (hasLongEnoughSchema && !sliceIncludesDots && shouldContinue) {
                const updatedOrder = produce(order, (draft) => {
                    draft.shift();
                });
                return memoizedSolve(
                    schema.slice(orderLength + 1),
                    updatedOrder
                );
            }
            return 0;
        }
        default: {
            return 0;
        }
    }
}

function orderToArray(orderString) {
    return orderString.split(",").map(Number);
}
