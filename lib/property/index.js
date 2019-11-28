'use strict';

/**
 * @class Property
 *
 * @param {Model} instance
 * @param {ƒ_type} type
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class Property {
    static create(instance, type) {
        return new Property(instance, type);
    }

    constructor(instance, type) {
        this.instance = instance;
        this.type = type;
        this._value = undefined;
    }

    split(key) {
        return Property
            .create(this.instance, this.type.split(key))
            .set(this.value && this.value[key])
        ;
    }

    set(value) {
        value = this.type.format(value, this.value);
        this.value = value;
        return this;
    }

    get() {
        return this.type.expose(this);
    }

    serialize(options) {
        return this.type.serialize(this.value, options);
    }

    validate(value) {
        return this.type.validate(value);
    }

    get key() {
        return this.type.key;
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
