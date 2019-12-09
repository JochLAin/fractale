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
        this._value = type.ℹ_regexp ? {} : undefined;
    }

    explode(key) {
        return Property
            .create(this.instance, this.type.fork(key))
            .set(this.value && this.value[key])
        ;
    }

    split(idx) {
        return Property
            .create(this.instance, this.type.split(idx))
            .set(this.value && this.value[idx])
        ;
    }

    set(value, name) {
        value = this.type.build(value, this.value, name);
        this.value = value;
        return this;
    }

    get(name) {
        return this.type.display(this, name);
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
