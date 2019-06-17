

const MixedPropertyDefiner = require('./mixed');
const library = require('../library');
const { promisified } = require('../helper/promise');

class ModelPropertyDefiner extends MixedPropertyDefiner {
    assign() {
        this.instance.props[`_${this.key}`] = null;
    }

    check(value) {
        if (typeof value === 'string') {
            value = library.get(this.type.name).memory.read(value);
        }

        return promisified(value, (value) => {
            if (typeof value === 'object') {
                value = new this.type(value, this.instance.props[this.key]);
            }
            if (value !== null && !(value instanceof this.type)) {
                throw MixedPropertyDefiner.createUncorrectTypeError(this, value, this.type.name + ' || uuid || null');
            }
            return value;
        });
    }

    setter() {
        return (value) => {
            return promisified(this.check(value), (value) => {
                this.value = this.normalize(value);
                this.instance.dispatchEvent('change', { key: this.key, value: this.value });
                return this.value;
            });
        };
    }

    getter() {
        return () => {
            return promisified(this.denormalize(this.instance.props[`_${this.key}`]), item => {
                if (item && item.addEventListener instanceof Function) {
                    item.addEventListener('change', () => this.instance.props[this.key] = item);
                }
                return item;
            });
        };
    }

    normalize(value) {
        return value === null ? null : value.uuid;
    }

    denormalize(value) {
        if (!value) return null;

        return promisified(library.get(this.type.name).memory.read(value), props => {
            if (this.options.through) {
                for (let index in this.options.through) {
                    props[this.options.through[index]] = this.instance.props[this.options.through[index]];
                }
            }

            return new this.type(props);
        });
    }
}

module.exports = ModelPropertyDefiner;
