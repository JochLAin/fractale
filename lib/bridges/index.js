/**
 * Base class that transform model into something else
 * @class Bridge
 * @property {String} name - Bridge name use in from/to shortcut method
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class Bridge {
    constructor(name) {
        this.name = name;
    }

    /**
     * Import something into a Fractale Model
     *
     * @param {Object} props - Properties to transform
     * @param {Object} options - Options passed with from shortcut method
     * @see Model
     * @return {Model}
     */
    import(props, options) {
        throw new Error(`Model cannot be created from ${this.name}`);
    }

    /**
     * Export a Fractale Model into something else
     *
     * @param {Model} model - Fractale Model to transform
     * @param {Object} options - Options passed with from shortcut method
     * @see Model
     * @return {Object}
     */
    export(model, options) {
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
