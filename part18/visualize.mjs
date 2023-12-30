import fs from "fs";

function isPathEqual(path1, path2) {
    return path1.x === path2.x && path1.y === path2.y;
}

export function visualize(grid, maxY, maxX) {
    const nextGrid = [];
    for (let i = 0; i < maxY; i++) {
        const line = [];
        for (let j = 0; j < maxX; j++) {
            const current = { x: j, y: i };
            const row = grid[i];
            const selectedPath = row.find((p) => isPathEqual(current, p));

            if (selectedPath) {
                line.push("#");
            } else {
                line.push(".");
            }
        }

        nextGrid.push(line);
    }

    let str = "";

    nextGrid.forEach((line) => {
        str += line.join("") + "\n";
    });

    fs.writeFileSync("visualized.txt", str);
}
