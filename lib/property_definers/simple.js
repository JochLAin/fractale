

const MixedPropertyDefiner = require('./mixed');

class SimplePropertyDefiner extends MixedPropertyDefiner {
    constructor(instance, key, type, options, name, generator) {
        super(instance, key, type, options);
        this.name = name;
        this.generator = generator;
    }

    assign() {
        const type = typeof this.type;
        this.instance.props[`_${this.key}`] = type === this.name ? this.type : null;
    }

    check(value) {
        if (value !== null && ![this.name].includes(typeof value)) {
            throw MixedPropertyDefiner.createUncorrectTypeError(this, value, this.name + ' || null');
        }
        return value;
    }

    normalize(value) {
        return value === null ? null : this.generator(value);
    }

    denormalize(value) {
        return value === null ? null : this.generator(value)
    }
}

module.exports = SimplePropertyDefiner;