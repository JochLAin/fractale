const ƒ_type = require('../index');
const base64 = require('../../../utils/base64');

module.exports = class ƒ_array_int32 extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, Int32Array, input, options);
    }

    static evaluate(input, type) {
        return type === 'object' && input instanceof Int32Array
            || type === 'function' && input === Int32Array
        ;
    }

    static get priority() {
        return 2;
    }

    expose(property) {
        if (property.value === undefined) return property.value;
        return new this.generator(base64.decode(property.value));
    }

    flatten(value) {
        if (value === undefined) return value;
        if (typeof value === 'string') return value;
        return base64.encode((new this.generator(value)).buffer);
    }

    validate(value) {
        if (value === undefined || value === null) {
            if (!this.options.required) return;
            throw this.createValidatorError('required', value, 'to be define');
        }
        if (!(value instanceof this.generator) && typeof value[Symbol.iterator] !== 'function' && !(typeof value === 'string' && base64.test(value))) {
            throw this.createIncorrectTypeError('Int32Array || Iterable || base64 || undefined', value);
        }
    }

    toBasic(replacer) {
        const value = String;
        if (replacer instanceof Function) return replacer(value, this);
        return value;
    }

    toJSON() {
        return this.generator.name;
    }
};
