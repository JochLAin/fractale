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
        this.instance.props[`_${this.key}`] = undefined;
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
        Object.defineProperty(this.instance.props, this.key, {
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
            return this.denormalize(this.instance.props[`_${this.key}`]);
        };
    }

    /**
     * Get the function that sets the value denormalized
     * @returns {Function}
     * @method
     */
    setter() {
        return (value) => {
            const previous = this.value;
            value = this.normalize(this.check(value));
            if (value !== previous) {
                this.value = value;
                this.instance.dispatchEvent('change', { key: this.key, value: this.value, previous });
            }
            return value;
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

    get value() {
        return this.instance.props[`_${this.key}`];
    }

    set value(value) {
        this.instance.props[`_${this.key}`] = value;
    }
}

class IncorrectTypeError extends Error {
    constructor(definer, key, type, value, compound, ...props) {
        super(...props);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, IncorrectTypeError);
        }
        this.name = 'IncorrectTypeError';
        if (compound) {
            this.message = `Expecting "${key}" to be array of ${type} but get '${value}'`;
        } else {
            this.message = `Expecting "${key}" to be ${type} but get '${value}'`;
        }
        this.definer = definer;
        this.key = key;
        this.type = type;
        this.value = value;
    }
}

MixedPropertyDefiner.createIncorrectTypeError = (definer, value, type) => {
    if (value instanceof ModelClass) {
        return new IncorrectTypeError(definer,`${definer.instance.constructor.name}.${definer.key}`, type, value.constructor.name);
    } else {
        return new IncorrectTypeError(definer,`${definer.instance.constructor.name}.${definer.key}`, type, typeof value);
    }
};

MixedPropertyDefiner.createIncorrectItemTypeError = (error, key) => {
    return new IncorrectTypeError(error.definer, `${error.definer.name}.${key}`, error.type, error.value, true);
};

module.exports = MixedPropertyDefiner;
