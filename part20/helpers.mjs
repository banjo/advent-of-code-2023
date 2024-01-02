export class Pulse {
    constructor({ isHigh }) {
        this.isHigh = isHigh;
    }
}

export class Module {
    lowPulses = 0;
    highPulses = 0;
    queue = [];

    /**
     * @param {string} name
     * @param {string[]} destinations
     */
    constructor(name, destinations) {
        this.name = name;
        this.destinations = destinations;
    }

    addToQueue(pulse, parentModule) {
        this.queue.push({ pulse, parentModule });
    }

    /**
     * @param {Pulse} pulse
     * @param {Module[]} modules
     */
    handle(modules, globalQueue, callback = null) {
        const affected = modules.filter((m) =>
            this.destinations.includes(m.name)
        );

        while (this.queue.length) {
            const { pulse: prePulse, parentModule } = this.queue.shift();

            const pulse = callback
                ? callback(prePulse, parentModule)
                : prePulse;

            if (!pulse) continue;

            affected.forEach((module) => {
                console.log(
                    `${this.name} -${pulse.isHigh ? "high" : "low"}-> ${
                        module.name
                    }`
                );
                module.addToQueue(pulse, this);

                if (pulse.isHigh) {
                    this.highPulses++;
                } else {
                    this.lowPulses++;
                }

                globalQueue.push(module);
            });
        }
    }
}

export class FlipFlopModule extends Module {
    isOn = false;

    handle(modules, globalQueue) {
        const pulseCallback = (pulse) => {
            if (pulse.isHigh) {
                return null;
            }

            this.isOn = !this.isOn;
            return new Pulse({ isHigh: this.isOn });
        };

        return super.handle(modules, globalQueue, pulseCallback);
    }
}

export class ConjunctionModule extends Module {
    inputs = {};

    addInputs(modules) {
        modules.forEach((module) => {
            this.inputs[module.name] = new Pulse({ isHigh: false });
        });
    }

    handle(modules, globalQueue) {
        const pulseCallback = (pulse, parentModule) => {
            this.inputs[parentModule.name] = pulse;

            if (Object.values(this.inputs).every((pulse) => pulse.isHigh)) {
                return new Pulse({ isHigh: false });
            } else {
                return new Pulse({ isHigh: true });
            }
        };

        return super.handle(modules, globalQueue, pulseCallback);
    }
}
