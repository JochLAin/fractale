

const BasicModel = require('../index');

class BasicPropertyDefiner {
    constructor(instance, key, type, options = {}) {
        this.instance = instance;
        this.key = key;
        this.type = type;
        this.options = options;
    }

    // Prepare property default value
    assign() {
        this.instance[`_${this.key}`] = undefined;
    }

    // Check if value correspond on property type
    check(value) {
        // Do nothing in this property definer
    }

    // Define getter and setter on property(ies)
    define() {
        Object.defineProperty(this.instance, this.key, {
            get: this.getter(),
            set: this.setter(),
        });
    }

    // Get getter of a property
    getter() {
        return () => {
            return this.denormalize(this.instance[`_${this.key}`]);
        };
    }

    // Get setter of a property
    setter() {
        return (value) => {
            this.check(value);
            this.instance[`_${this.key}`] = this.normalize(value);
            this.instance.dispatchEvent('change');
        };
    }

    // Get getter of a property
    normalize(value) {
        return value;
    }

    denormalize(value) {
        return value;
    }
}

class UncorrectTypeError extends Error {
    constructor(name, type, value) {
        super();
        this.name = name;
        this.type = type;
        this.value = value;
    }

    get isArray() {
        return this._isArray;
    }

    set isArray(isArray) {
        this._isArray = isArray;
    }

    get message() {
        if (this.isArray) {
            return `Expecting "${this.name}" to be array of ${this.type} but get '${this.value}'`
        } else {
            return `Expecting "${this.name}" to be ${this.type} but get '${this.value}'`
        }
    }
}

BasicPropertyDefiner.createUncorrectTypeError = (definer, value, type) => {
    if (value instanceof BasicModel) {
        return new UncorrectTypeError(`${definer.instance.constructor.name}.${definer.key}`, type, value.constructor.name);
    } else {
        return new UncorrectTypeError(`${definer.instance.constructor.name}.${definer.key}`, type, typeof value);
    }
}

module.exports = BasicPropertyDefiner;