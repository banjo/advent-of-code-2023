import { first, isEmpty, produce } from "@banjoanton/utils";
import fs from "fs";

const rows = fs
    .readFileSync("./test.txt", "utf-8")
    .trim()
    .split("\n")
    .filter((s) => !isEmpty(s))
    .map((s) => s.split(" "))
    .map(([schema, order]) => {
        const updatedSchema = new Array(5).fill(schema).join("?");
        const updatedOrder = new Array(5).fill(order).join(",");
        return [updatedSchema, updatedOrder];
    });

let total = 0;
for (const [schema, orderString] of rows) {
    const order = orderToArray(orderString);
    const arrangements = solve(schema, order);
    total += arrangements;
}

console.log(total);

function solve(schema, order) {
    if (isEmpty(schema) && isEmpty(order)) {
        return 1;
    }

    if (isEmpty(order) && !order.some((v) => v === "#")) {
        return 1;
    }

    const firstChar = schema[0];

    switch (firstChar) {
        case ".": {
            return solve(schema.slice(1), order);
        }
        case "?": {
            const restOfSchema = schema.slice(1);
            const first = "." + restOfSchema;
            const firstAmount = solve(first, order);

            const second = "#" + restOfSchema;
            const secondAmount = solve(second, order);
            return firstAmount + secondAmount;
        }
        case "#": {
            const orderLength = first(order);

            if (schema.length < orderLength) {
                return 0;
            }

            const partOfSchema = schema.slice(0, orderLength);
            const hasDots = partOfSchema.split("").some((c) => c === ".");

            if (hasDots) {
                return 0;
            }

            const brokenAmount = schema.match(/#+/)[0].length;

            if (brokenAmount > orderLength) {
                return 0;
            }

            const updatedOrder = produce(order, (draft) => {
                draft.shift();
            });

            return solve(schema.slice(orderLength + 1), updatedOrder);
        }
        default: {
            return 0;
        }
    }
}

function orderToArray(orderString) {
    return orderString.split(",").map(Number);
}
