import fs from "fs";

const words = fs.readFileSync("./input.txt", "utf-8").split(",");

const boxes = {};
words.forEach((word) => {
    const match = word.match(/(\w+)(=|-)/);
    const [, label, operator] = match;
    const hashed = hash(label);
    let box = boxes[hashed] ?? [];

    if (operator === "-") {
        box = box.filter((b) => b.label !== label);
    } else {
        const focal = word.match(/\d+/)[0];
        const oldLens = box.find((v) => v.label === label);

        if (oldLens) {
            const index = box.indexOf(oldLens);
            box[index] = { label, focal: Number(focal) };
        } else {
            box.push({ label, focal: Number(focal) });
        }
    }

    boxes[hashed] = box;
}, 0);

let total = 0;
Object.entries(boxes).forEach(([index, box]) => {
    const number = Number(index) + 1;

    box.forEach((lens, idx) => {
        const place = idx + 1;
        const length = lens.focal;
        total += number * place * length;
    });
});

console.log(total);

function hash(word) {
    let currentValue = 0;

    word.split("").forEach((char) => {
        const ascii = char.charCodeAt(0);
        currentValue += ascii;
        currentValue *= 17;
        currentValue = currentValue % 256;
    });

    return currentValue;
}
