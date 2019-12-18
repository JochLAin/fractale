module.exports = class Bridge {
    constructor(name) {
        this.name = name;
    }

    import() {
        throw new Error(`Model cannot be created from ${this.name}`);
    }

    export() {
        throw new Error(`Model cannot be transformed to ${this.name}`);
    }
};

let bridges = [];
module.exports.get = () => bridges;
module.exports.add = (Bridge) => {
    const _typeof = typeof Bridge;
    if (_typeof !== 'function') {
        throw new Error(`Expected class got ${typeof Bridge}`);
    }
    if (!(Bridge.prototype instanceof module.exports)) {
        throw new Error(`The bridge ${Bridge.name} doesn't extend the base property bridge`);
    }
    const bridge = new Bridge;
    if (!bridge.name) {
        throw new Error(`The bridge ${Bridge.name} doesn't have a name`);
    }
    bridges.push(bridge);
};

module.exports.add(require('./mongoose'));
module.exports.add(require('./prop_types'));
