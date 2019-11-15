const Model = require('../model');
const MixedPropertyDefiner = require('./mixed');

module.exports = class ModelPropertyDefiner extends MixedPropertyDefiner {
    setter() {
        return (value) => {
            if (!this.validate(value)) return false;

            const previous = this.value;
            value = this.normalize(value, this.get());
            if (value !== previous) {
                this.value = value;
                this.instance.dispatchEvent('change', {
                    key: this.key,
                    value: this.value,
                    previous
                });
            }
            return this.value;
        };
    }

    getter() {
        return () => {
            const item = this.denormalize(this.value);
            if (item instanceof Model) {
                item.addEventListener('change', () => {
                    this.instance.props[this.key] = item;
                });
            }
            return item;
        };
    }

    normalize(value) {
        if (!value) return undefined;
        if (typeof value === 'string') return value;

        const previous = this.get();
        if (value instanceof this.field.value) {
            return value.uuid;
        } else if (!previous && !value.uuid) {
            const entity = new this.field.value(value);
            this.field.value.memory.create(entity);
            return entity.uuid;
        } else if (previous && (!value.uuid || value.uuid === previous.uuid)) {
            previous.deserialize(value);
            return previous.uuid;
        } else {
            let entity = previous ? previous.serialize(false) : this.field.value.memory.read(value.uuid);
            if (entity) {
                Object.assign(entity, value);
                this.field.value.memory.update(entity);
                return entity.uuid;
            } else {
                this.field.value.memory.create(value);
                return value.uuid;
            }
        }
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
        if (value === undefined) return true;
        if (typeof value === 'string') return true;
        if (typeof value === 'object') return true;

        const type = value instanceof Model ? value.constructor.name : typeof value;
        throw MixedPropertyDefiner.createIncorrectTypeError(this, this.field.value.name + ' || uuid || undefined', type);
    }
};
