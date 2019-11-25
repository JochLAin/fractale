const { FIELD_KIND_MODEL } = require('../constants');
const Collection = require('./collection');

/**
 * @class
 */
const Property = module.exports = class Property {
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
        return Property.create(this.instance, this.field.fork(key));
    }

    get(key) {
        if (this.ƒ_array) {
            return new Collection(this, this.getValue(key));
        }
        const value = this.field.get(this.getValue(key));
        if (value && this.field.is(FIELD_KIND_MODEL)) {
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

    set(value, key) {
        value = this.field.set(value, this.getValue(key));
        this.setValue(value, key);
        return this;
    }

    normalize(value) {
        return this.field.normalize(value, this.getValue());
    }

    denormalize(value) {
        return this.field.denormalize(value, this.getValue());
    }

    serialize(options) {
        return this.field.serialize(this.getValue(), options);
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

    setValue(value, key) {
        if (!key) key = this.key;
        if (!this.ƒ_regexp || key === this.key) {
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
        } else if (!this._value) {
            this._value = {};
            this._value[key] = value;
            this.instance.emit('change', {
                key: this.key,
                value: this._value,
            });
        } else {
            if (value === this._value[key]) {
                return this._value[key];
            }
            const previous = this._value[key];
            this._value[key] = value;
            this.instance.emit('change', {
                key: this.key,
                value: this._value,
            });
            this.instance.emit('change', {
                key: key,
                value: value,
                previous
            });
        }
        return this._value;
    }

    getValue(key) {
        if (!this._value) return this._value;
        if (!this.ƒ_regexp) return this._value;
        if (!key) key = this.key;
        if (key === this.key) return this._value;
        return this._value[key];
    }
};
