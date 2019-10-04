

const MixedPropertyDefiner = require('./mixed');
const memory = require('../memory');
const library = require('../library');
const { promisified } = require('../helpers/promise');

class ModelPropertyDefiner extends MixedPropertyDefiner {
    constructor(instance, name, key, type, options) {
        super(instance, name, key, type, options);
        this.proxy = library.get(this.name).proxy;
    }

    assign() {
        this.value = null;
    }

    check(value) {
        if (typeof value === 'string') {
            value = memory.read(this.name, value);
        }
        if (typeof value === 'object') {
            value = new this.type(value, { from: this.instance.props[this.key] });
        }
        if (value !== null && !(value instanceof this.type)) {
            throw MixedPropertyDefiner.createUncorrectTypeError(this, value, this.name + ' || uuid || null');
        }
        return value;
    }

    getter() {
        return () => {
            const item = this.denormalize(this.value);

            if (item && item.addEventListener instanceof Function) {
                item.addEventListener('change', () => {
                    this.instance.props[this.key] = item;
                });
            }
            return item;
        };
    }

    normalize(value) {
        return value === null ? null : value.uuid;
    }

    denormalize(value) {
        if (!value) return null;

        return promisified(memory.read(this.type.name, value), (props) => {
            if (this.options.through) {
                for (let index in this.options.through) {
                    props[this.options.through[index]] = this.instance.props[this.options.through[index]];
                }
            }
            return new this.proxy(props);
        });
    }
}

module.exports = ModelPropertyDefiner;
