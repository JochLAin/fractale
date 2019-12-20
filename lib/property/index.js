/**
 * @class Property
 *
 * @param {Model} instance
 * @param {PropertyType} type
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

    /**
     * Create a new property for ModelPropertyType
     * It helps for display comprehensible errors
     *
     * @param {String} key
     * @return {Property}
     */
    explode(key) {
        return Property
            .create(this.instance, this.type.fork(key))
            .set(this.value && this.value[key])
        ;
    }

    /**
     * Create a new property for ArrayPropertyType
     * It helps for display comprehensible errors
     *
     * @param {Number} idx
     * @return {Property}
     */
    split(idx) {
        return Property
            .create(this.instance, this.type.split(idx))
            .set(this.value && this.value[idx])
        ;
    }

    /**
     * Set the value after its formatting
     *
     * @param {*} value
     * @param {String} name - Field name
     * @return {Property}
     */
    set(value, name) {
        value = this.type.build(value, this.value, name);
        this.value = value;
        return this;
    }

    /**
     * Get the value after its formatting
     *
     * @param {String} name - Field name
     * @return {*}
     */
    get(name) {
        return this.type.display(this, name);
    }

    /**
     * Serialize the current value
     *
     * @param {String} options - Options for serialization
     * @return {*}
     */
    serialize(options) {
        return this.type.serialize(this.value, options);
    }

    /**
     * Validate a value for this property type
     *
     * @param value
     * @throws IncorrectTypeError
     * @throws ValidatorError
     */
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
