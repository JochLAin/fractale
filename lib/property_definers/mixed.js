const ModelClass = require('../model');

/**
 * Define property on an instance of ModelClass
 * @class
 */
class MixedPropertyDefiner {
    /**
     * @param {ModelClass} instance
     * @param {String} key
     * @param {undefined|null} type
     * @param {Object} options - Options passed on property definer
     */
    constructor(instance, key, type, options = {}) {
        this.instance = instance;
        this.key = key;
        this.type = type;
        this.options = options;
    }

    /**
     * Prepare property default value
     * @method
     */
    assign() {
        this.instance[`_${this.key}`] = undefined;
    }

    /**
     * Check if value correspond on property type
     * @param value
     * @method
     */
    check(value) {
        // Mixed do nothing in this property definer
        return value;
    }

    /**
     * Define getter and setter on property(ies)
     * @method
     */
    define() {
        Object.defineProperty(this.instance, this.key, {
            get: this.getter(),
            set: this.setter(),
        });
    }

    /**
     * Get the function that returns the value denormalized
     * @returns {function(): *}
     * @method
     */
    getter() {
        return () => {
            return this.denormalize(this.instance[`_${this.key}`]);
        };
    }

    /**
     * Get the function that sets the value denormalized
     * @returns {Function}
     * @method
     */
    setter() {
        return (value) => {
            value = this.check(value);
            this.instance[`_${this.key}`] = this.normalize(value);
            this.instance.dispatchEvent('change', { key: this.key, value });
        };
    }

    /**
     * Normalize the value
     * @param value
     * @returns {*}
     */
    normalize(value) {
        return value;
    }

    /**
     * Denormalize the value
     * @method
     */
    denormalize(value) {
        return value;
    }
}

class UncorrectTypeError extends Error {
    constructor(definer, key, type, value, compound) {
        if (compound) {
            super(`Expecting "${key}" to be array of ${type} but get '${value}'`);
        } else {
            super(`Expecting "${key}" to be ${type} but get '${value}'`);
        }
        this.name = 'UncorrectTypeError';
        this.definer = definer;
        this.key = key;
        this.type = type;
        this.value = value;
    }
}

MixedPropertyDefiner.createUncorrectTypeError = (definer, value, type) => {
    if (value instanceof ModelClass) {
        return new UncorrectTypeError(definer,`${definer.instance.constructor.name}.${definer.key}`, type, value.constructor.name);
    } else {
        return new UncorrectTypeError(definer,`${definer.instance.constructor.name}.${definer.key}`, type, typeof value);
    }
};

MixedPropertyDefiner.createUncorrectItemTypeError = (error, key) => {
    return new UncorrectTypeError(error.definer, `${error.definer.instance.constructor.name}.${key}`, error.type, error.value, true);
};

module.exports = MixedPropertyDefiner;