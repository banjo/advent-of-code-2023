import fs from "fs";

function isPathEqual(path1, path2) {
    return path1.x === path2.x && path1.y === path2.y;
}

export function visualize(grid, visited) {
    const verticalLength = grid.length;
    const horizontalLength = grid[0].length;

    const nextGrid = [];
    for (let i = 0; i < verticalLength; i++) {
        const line = [];
        for (let j = 0; j < horizontalLength; j++) {
            const current = { x: j, y: i };
            const selectedPath = visited.find((p) => isPathEqual(current, p));

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
