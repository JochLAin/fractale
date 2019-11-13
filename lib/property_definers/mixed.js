const Model = require('../model');

/**
 * Define property on an instance of Model
 * @class
 */
class MixedPropertyDefiner {
    /**
     * @param {Model} instance
     * @param {String} key
     * @param {undefined|null} type
     * @param {Object} options - Options passed on property definer
     */
    constructor(key, type, options = {}) {
        this.key = key;
        this.type = type;
        this.options = options;
    }

    /**
     * Prepare property default value
     * @method
     */
    assign(instance) {
        instance.props[`_${this.key}`] = undefined;
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
    define(instance) {
        Object.defineProperty(instance.props, this.key, {
            get: this.getter(instance),
            set: this.setter(instance),
        });
    }

    /**
     * Get the function that returns the value denormalized
     * @returns {function(): *}
     * @method
     */
    getter(instance) {
        return () => {
            return this.denormalize(instance.props[`_${this.key}`]);
        };
    }

    /**
     * Get the function that sets the value denormalized
     * @returns {Function}
     * @method
     */
    setter(instance) {
        return (value) => {
            const previous = this.getValue(instance);
            value = this.normalize(this.check(value));
            if (value !== previous) {
                this.value = value;
                instance.dispatchEvent('change', { key: this.key, value: this.value, previous });
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

    getValue(instance) {
        return instance.props[`_${this.key}`];
    }

    setValue(instance, value) {
        instance.props[`_${this.key}`] = value;
    }
}

class IncorrectTypeError extends Error {
    constructor(definer, instance, key, type, value, compound, ...props) {
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
        this.instance = instance;
        this.key = key;
        this.type = type;
        this.value = value;
    }
}

MixedPropertyDefiner.createIncorrectTypeError = (definer, instance, value, type) => {
    if (value instanceof Model) {
        return new IncorrectTypeError(definer,`${instance.constructor.name}.${definer.key}`, type, value.constructor.name);
    } else {
        return new IncorrectTypeError(definer,`${instance.constructor.name}.${definer.key}`, type, typeof value);
    }
};

MixedPropertyDefiner.createIncorrectItemTypeError = (error, key) => {
    return new IncorrectTypeError(error.definer, `${error.instance.constructor.name}.${key}`, error.type, error.value, true);
};

module.exports = MixedPropertyDefiner;
