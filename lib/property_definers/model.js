

const MixedPropertyDefiner = require('./mixed');
const library = require('../library');

class ModelPropertyDefiner extends MixedPropertyDefiner {
    assign() {
        this.instance[`_${this.key}`] = null;
    }

    check(value) {
        if (typeof value === 'string') {
            value = library.get(this.type.name).get(value);
        }
        if (typeof value === 'object') {
            value = new this.type(value, this.instance[this.key]);
        }
        if (value !== null && !(value instanceof this.type)) {
            throw MixedPropertyDefiner.createUncorrectTypeError(this, value, this.type.name + ' || uuid || null');
        }
        return value;
    }

    setter() {
        return (value) => {
            this.value = this.check(value);
            this.instance.dispatchEvent('change', { key: this.key, value: this.value });
        };
    }

    getter() {
        return () => {
            const item = this.denormalize(this.instance[`_${this.key}`]);

            if (item && item.addEventListener instanceof Function) {
                item.addEventListener('change', () => this.instance[this.key] = item);
            }
            return item;
        };
    }

    normalize(value) {
        return value === null ? null : value.uuid;
    }

    denormalize(value) {
        if (!value) return null;

        const onFulfilled = (props) => {
            if (this.options.through) {
                for (let index in this.options.through) {
                    props[this.options.through[index]] = this.instance[this.options.through[index]];
                }
            }
            return new this.type(props);
        };

        const props = library.get(this.type.name).memory.read(value);
        if (props instanceof Promise) {
            return props.then(onFulfilled);
        }
        return onFulfilled(props);
    }
}

module.exports = ModelPropertyDefiner;
