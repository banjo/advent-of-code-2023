import fs from "fs";

const visMap = {
    down: "v",
    up: "^",
    left: "<",
    right: ">",
};

function isPathEqual(path1, path2) {
    return path1.x === path2.x && path1.y === path2.y;
}

export function visualize(result, grid) {
    const verticalLength = grid.length;
    const horizontalLength = grid[0].length;

    const { path } = result;
    const nextGrid = [];
    for (let i = 0; i < verticalLength; i++) {
        const line = [];
        for (let j = 0; j < horizontalLength; j++) {
            const current = { x: j, y: i };
            const selectedPath = path.find((p) => isPathEqual(current, p));

            if (selectedPath) {
                const index = path.indexOf(selectedPath);
                const symbol =
                    index > 0 ? visMap[path[index - 1].direction] ?? "S" : "0";

                line.push(symbol);
            } else {
                const value = grid[i][j];
                line.push(value);
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
