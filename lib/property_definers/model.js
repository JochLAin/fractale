const models = require('../model');
const MixedPropertyDefiner = require('./mixed');

module.exports = class ModelPropertyDefiner extends MixedPropertyDefiner {
    getter() {
        return () => {
            const item = this.denormalize(this.value);
            if (!item) return item;
            item.on('change', ({ key, previous, value }) => {
                this.instance.emit('change', { key: `${this.key}.${key}`, previous, value });
            });
            return item;
        };
    }

    normalize(value) {
        if (!value) return undefined;
        if (typeof value === 'string') return value;
        if (value instanceof this.field.value) return value.uuid;

        return this.field.value.save(value, this.value);
    }

    denormalize(value) {
        if (!value) return undefined;
        const props = this.field.value.memory.read(value);
        if (this.field.options.through) {
            for (let index in this.field.options.through) {
                if (this.field.options.through.hasOwnProperty(index)) {
                    const key = this.field.options.through[index];
                    props[key] = this.instance.props[key];
                }
            }
        }
        return new this.field.value.proxy(props);
    }

    validate(value) {
        if (value !== undefined && typeof value !== 'string' && typeof value !== 'object') {
            throw MixedPropertyDefiner.createIncorrectTypeError(this,  `${this.field.value.name} || uuid || undefined`, value);
        }
        if (typeof value === 'object' && !['Boolean','Number','String','Object','Array'].includes(value.constructor.name) && !(value instanceof models.get())) {
            throw MixedPropertyDefiner.createIncorrectTypeError(this,  `instance of ${this.field.value.name}`, value.constructor.name, true);
        }
        MixedPropertyDefiner.prototype.validate.call(this, value);
        return true;
    }
};
