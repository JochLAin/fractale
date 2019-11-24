/**
 * @class
 */
const Property = module.exports = class Property {
    constructor(instance, field) {
        this.instance = instance;
        this.field = field;
        this._value = undefined;
    }

    get(...args) {
        return this.field.type.get(this, ...args);
    }

    set(...args) {
        return this.field.type.set(this, ...args);
    }

    normalize(...args) {
        return this.field.normalize(...args);
    }

    denormalize(...args) {
        return this.field.denormalize(...args);
    }

    serialize(...args) {
        return this.field.serialize(this.value, ...args);
    }

    deserialize(...args) {
        return this.field.deserialize(this.value, ...args);
    }

    validate(...args) {
        return this.field.validate(...args);
    }

    get key() {
        return this.field.key;
    }

    get options() {
        return this.field.options;
    }

    set value(value) {
        if (value === this.value) {
            return this.value;
        }
        const previous = this.value;
        this._value = value;
        this.instance.emit('change', {
            key: this.key,
            value: this.value,
            previous
        });
        return this._value = value;
    }

    get value() {
        return this._value;
    }
};

module.exports.PropertyItem = class PropertyItem extends Property {
    constructor(instance, field, index) {
        super(instance, field);
        this.index = index;
    }

    get key() {
        return `${this.field.key}[${this.index}]`;
    }
};

module.exports.PropertyRegExp = class PropertyRegExp extends Property {

};