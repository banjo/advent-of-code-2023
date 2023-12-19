import { isEmpty } from "@banjoanton/utils";
import fs from "fs";

const currentCubes = {
    red: 12,
    green: 13,
    blue: 14,
};

const games = fs
    .readFileSync("./input.txt", "utf-8")
    .split("\n")
    .map(trim)
    .filter(isNonEmpty)
    .map(parseGame);

const result = games.reduce((acc, current) => {
    return checkIfBreaking(current.cubes) ? acc : acc + current.id;
}, 0);

console.log(result);

function parseGame(game) {
    const id = Number(game.match(/\d+:/)[0].replace(":", ""));
    const sets = game.split(":")[1].split(";").map(trim);
    const cubes = sets.map((s) => ({
        blue: getCubes(s, "blue"),
        red: getCubes(s, "red"),
        green: getCubes(s, "green"),
    }));

    return {
        id,
        cubes,
    };
}

function checkIfBreaking(cubes) {
    return cubes.some(
        (c) =>
            c.red > currentCubes.red ||
            c.green > currentCubes.green ||
            c.blue > currentCubes.blue
    );
}

function trim(str) {
    return str.trim();
}

function isNonEmpty(obj) {
    return !isEmpty(obj);
}

function getCubes(str, color) {
    const regex = new RegExp(`\\d+ ${color}`, "g");
    const match = str.match(regex)?.[0].match(/\d+/)?.[0];
    return match ? Number(match) : 0;
}
