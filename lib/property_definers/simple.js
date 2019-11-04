const MixedPropertyDefiner = require('./mixed');

class SimplePropertyDefiner extends MixedPropertyDefiner {
    constructor(instance, key, type, options, classs, generator) {
        super(instance, key, type, options);
        this.classs = classs;
        this.generator = generator;
    }

    assign() {
        const type = typeof this.type;
        this.instance.props[`_${this.key}`] = type === this.classs ? this.type : null;
    }

    check(value) {
        if (value !== null && ![this.classs].includes(typeof value)) {
            throw MixedPropertyDefiner.createUncorrectTypeError(this, value, this.classs + ' || null');
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