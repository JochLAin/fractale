'use strict';

const Collection = require('./collection');

/**
 * @class Property
 *
 * @param {Model} instance
 * @param {Field} field
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class Property {
    static create(instance, field) {
        return new Property(instance, field);
    }

    constructor(instance, field) {
        this.instance = instance;
        this.field = field;
        this._value = undefined;
        this.ƒ_property = true;
    }

    fork(key) {
        return Property
            .create(this.instance, this.field.fork(key))
            .set(this.value && this.value[key])
        ;
    }

    get() {
        if (this.ƒ_array) {
            return new Collection(this, this.value);
        }
        const value = this.field.get(this.value);
        if (value && this.field.is('ƒ_model')) {
            if (this.options.through) {
                const through = this.options.through;
                for (let index = 0, length = through.length; index < length; index++) {
                    const key = this.options.through[index];
                    value[key] = this.instance.get(key);
                }
            }
            const item = new this.field.value.proxy(value);
            item.on('change', ({ key, previous, value }) => {
                this.instance.emit('change', {
                    key: `${this.field.key}.${key}`,
                    previous,
                    value
                });
            });
            return item;
        }
        return value;
    }

    set(value) {
        value = this.field.format(value, this.value);
        this.value = value;
        return this;
    }

    normalize(value) {
        return this.field.normalize(value, this.value);
    }

    denormalize(value) {
        return this.field.denormalize(value, this.value);
    }

    serialize(options) {
        return this.field.serialize(this.value, options);
    }

    deserialize(value) {
        return this.field.deserialize(value);
    }

    validate(value) {
        return this.field.validate(value);
    }

    get ƒ_array() {
        return this.field.ƒ_array;
    }

    get ƒ_regexp() {
        return this.field.ƒ_regexp;
    }

    get key() {
        return this.field.key;
    }

    get options() {
        return this.field.options;
    }

    set value(value) {
        if (value === this._value) {
            return this._value;
        }
        const previous = this._value;
        this._value = value;
        this.instance.emit('change', {
            key: this.key,
            value: this._value,
            previous
        });
        return this._value;
    }

    get value() {
        return this._value;
    }
};
