

const MixedPropertyDefiner = require('./mixed');
const library = require('../library');
const console = require('../../tests/console');

class ModelPropertyDefiner extends MixedPropertyDefiner {
    assign() {
        this.instance[`_${this.key}`] = null;
    }

    check(value) {
        if (typeof value === 'string') {
            value = library.get(this.instance.constructor.name).get(value);
        }
        if (value !== null && !(value instanceof this.type || typeof value == 'object')) {
            throw MixedPropertyDefiner.createUncorrectTypeError(this, value, this.type.name + ' or null');
        }
        return value;
    }

    setter() {
        return (value) => {
            value = this.check(value);
            this.instance[`_${this.key}`] = this.normalize(value);
            this.instance.dispatchEvent('change', { key: this.key, value });
        };
    }

    getter() {
        return () => {
            const item = this.denormalize(this.instance[`_${this.key}`]);

            if (item) {
                item.addEventListener('change', () => {
                    this.instance[this.key] = item;
                });
            }
            return item;
        };
    }

    normalize(value) {
        if (typeof value == 'string') {
            return value;
        }

        if (typeof value === 'object') {
            value = new this.type(value, this.instance[this.key]);
        }
        if (value instanceof this.type) {
            value = value.serialize();
        }
        return value === null ? null : value.uuid;
    }

    denormalize(value) {
        if (!value) return null;

        value = library.get(this.type.name).get(value);
        if (this.options.through) {
            for (let index in this.options.through) {
                value[this.options.through[index]] = this.instance[this.options.through[index]];
            }
        }
        return new this.type(value);
    }
}

module.exports = ModelPropertyDefiner;
