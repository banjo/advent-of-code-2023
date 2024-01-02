import fs from "fs";
import {
    ConjunctionModule,
    FlipFlopModule,
    Module,
    Pulse,
} from "./helpers.mjs";

const modules = parse();
addInputsToConjunction(modules);
addNamelessModules(modules);

const score = run(modules, 1000);
console.log(score);

function run(modules, loops) {
    const button = new Module("button", ["broadcaster"]);
    const globalQueue = [];

    for (let i = 0; i < loops; i++) {
        button.addToQueue(new Pulse({ isHigh: false }));
        button.handle(modules, globalQueue);

        while (globalQueue.length) {
            const module = globalQueue.shift();
            module.handle(modules, globalQueue);
        }
    }

    return getScore([button, ...modules]);
}

function getScore(modules) {
    const res = modules.reduce(
        (acc, module) => {
            return {
                high: acc.high + module.highPulses,
                low: acc.low + module.lowPulses,
            };
        },
        { high: 0, low: 0 }
    );

    return res.high * res.low;
}

function addInputsToConjunction(modules) {
    modules.forEach((module) => {
        if (!(module instanceof ConjunctionModule)) {
            return;
        }

        const inputsForModule = modules.filter((m) =>
            m.destinations.includes(module.name)
        );

        module.addInputs(inputsForModule);
    });
}

function addNamelessModules(modules) {
    modules.forEach((module) => {
        module.destinations.forEach((dest) => {
            if (!modules.some((m) => m.name === dest)) {
                modules.push(new Module(dest, []));
            }
        });
    });
}

function parse() {
    return fs
        .readFileSync("./input.txt", "utf-8")
        .split("\n")
        .map((row) => {
            const [, name, destinations] = row.match(/(.*) -> (.*)/);
            const splittedDestinations = destinations.split(", ");

            if (name[0] === "%") {
                return new FlipFlopModule(name.slice(1), splittedDestinations);
            } else if (name === "broadcaster") {
                return new Module(name, splittedDestinations);
            } else {
                return new ConjunctionModule(
                    name.slice(1),
                    splittedDestinations
                );
            }
        });
}
