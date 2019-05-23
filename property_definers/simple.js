

const BasicPropertyDefiner = require('./basic');

class SimplePropertyDefiner extends BasicPropertyDefiner {
    constructor(instance, key, type, options, name, generator) {
        super(instance, key, type, options);
        this.name = name;
        this.generator = generator;
    }

    assign() {
        const type = typeof this.type;
        this.instance[`_${this.key}`] = type === this.name ? this.type : null;
    }

    check(value) {
        if (value !== null && ![this.name].includes(typeof value)) {
            throw BasicPropertyDefiner.createUncorrectTypeError(this, value, this.name + ' or null');
        }
    }

    normalize(value) {
        return value === null ? null : this.generator(value);
    }

    denormalize(value) {
        return value === null ? null : this.generator(value)
    }
}

module.exports = SimplePropertyDefiner;