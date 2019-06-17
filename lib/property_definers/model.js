

const MixedPropertyDefiner = require('./mixed');
const memory = require('../memory');

class ModelPropertyDefiner extends MixedPropertyDefiner {
    assign() {
        this.instance.props[`_${this.key}`] = null;
    }

    check(value) {
        if (typeof value === 'string') {
            value = memory.read(this.type.name, value);
        }
        if (typeof value === 'object') {
            value = new this.type(value, this.instance.props[this.key]);
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
            const item = this.denormalize(this.instance.props[`_${this.key}`]);

            if (item && item.addEventListener instanceof Function) {
                item.addEventListener('change', () => this.instance.props[this.key] = item);
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
                    props[this.options.through[index]] = this.instance.props[this.options.through[index]];
                }
            }
            return new this.type(props);
        };

        const props = memory.read(this.type.name, value);
        if (props instanceof Promise) {
            return props.then(onFulfilled);
        }
        return onFulfilled(props);
    }
}

module.exports = ModelPropertyDefiner;
