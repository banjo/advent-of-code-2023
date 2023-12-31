import { sum } from "@banjoanton/utils";
import fs from "fs";

const comparatorMap = {
    "<": (rating, value) => {
        return rating < value;
    },
    ">": (rating, value) => {
        return rating > value;
    },
};

const BASE_OUTCOMES = Object.freeze({
    ACCEPTED: "A",
    REJECTED: "R",
});

class Ratings {
    constructor({ x, m, a, s }) {
        this.x = x;
        this.m = m;
        this.a = a;
        this.s = s;
    }
}

class Rule {
    constructor({ rating, operator, value, nextWorkflow }) {
        this.rating = rating;
        this.operator = operator;
        this.value = value;
        this.nextWorkflow = nextWorkflow;
    }

    /**
     * @param {Ratings} ratings
     * @returns {Boolean}
     */
    execute(ratings) {
        const correctRating = ratings[this.rating];
        return comparatorMap[this.operator](correctRating, this.value);
    }
}

class Workflow {
    /**
     * @type {Rule[]} Array of rule instances
     */
    _rules = [];
    defaultNext = null;

    /**
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * @param {Rule} rule The Rule to add to the Workflow.
     */
    addRule(rule) {
        this._rules.push(rule);
    }

    /**
     * @param {Workflow.name} workflowName
     */
    addDefault(workflowName) {
        this.defaultNext = workflowName;
    }

    /**
     *
     * @param {Ratings} rating
     */
    executeRules(rating) {
        if (this._rules.length === 0) {
            return this.defaultNext;
        }

        for (const rule of this._rules) {
            const success = rule.execute(rating);
            if (success) {
                return rule.nextWorkflow;
            }
        }

        return this.defaultNext;
    }
}

const [workflows, ratings] = fs
    .readFileSync("./input.txt", "utf-8")
    .split("\n\n")
    .map((row) => row.split("\n"));

const parsedWorkflows = workflows.map((w) => {
    const name = w.split("{")[0];

    const workflow = new Workflow(name);

    const [, conditions] = w.match(/{(.*)}/);
    let defaultNext = null;
    conditions.split(",").forEach((condition) => {
        if (!condition.includes(":")) {
            defaultNext = condition;
            return;
        }

        const [comparison, nextWorkflow] = condition.split(":");

        const [, rating, operator, value] = comparison.match(
            /([A-Za-z]+)(\<|\>)(\d+)/
        );

        const rule = new Rule({
            rating,
            operator,
            value: Number(value),
            nextWorkflow,
        });

        workflow.addRule(rule);
    });

    workflow.addDefault(defaultNext);

    return workflow;
});

const parsedRatings = ratings.map((r) => {
    const [, x, m, a, s] = r.match(/x=(\d+),m=(\d+),a=(\d+),s=(\d+)/);

    return new Ratings({
        x: Number(x),
        m: Number(m),
        a: Number(a),
        s: Number(s),
    });
});

const startWorkflow = parsedWorkflows.find((w) => w.name === "in");
const total = parsedRatings.reduce((acc, ratings) => {
    const queue = [startWorkflow];

    while (queue.length) {
        const workflow = queue.shift();
        const next = workflow.executeRules(ratings);

        if (next === BASE_OUTCOMES.REJECTED) {
            return acc;
        } else if (next === BASE_OUTCOMES.ACCEPTED) {
            return acc + sum(Object.values(ratings));
        }

        const nextWorkflow = parsedWorkflows.find((w) => w.name === next);
        queue.push(nextWorkflow);
    }
}, 0);

console.log(total);
