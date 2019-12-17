const base64 = require('../../utils/base64');
const ƒ_type = require('../index');

module.exports = class ƒ_blob extends ƒ_type {
    constructor(schema, key, input, options) {
        if (!window || !window.Blob) {
            throw new Error(`You trying to use Blob on a non-window environment, please use ArrayBuffer instead`);
        }
        super(schema, key, input, options);
        this.input = window.Blob;
    }

    static evaluate(input, type) {
        return type === 'object' && input instanceof window.Blob
            || type === 'function' && input === window.Blob
        ;
    }

    static get priority() {
        return 3;
    }

    expose(property) {
        if (property.value === undefined) return property.value;
        const buffer = base64.decode(property.value.split(',')[1]);
        const mimetype = property.value.split(',')[0].split(':')[1].split(';')[0];
        return new window.Blob([buffer], { type: mimetype });
    }

    flatten(value) {
        if (value === undefined) return value;
        if (typeof value === 'string') return value;
        return window.URL.createObjectURL(value);
    }

    validate(value) {
        if (value === undefined) return;
        if (!(value instanceof this.input) && typeof value !== 'string') {
            throw this.createIncorrectTypeError('window.Blob || base64 URL || undefined', value);
        }
        if (typeof value === 'string') {
            try { new window.URL(value); } catch (error) {
                if (error instanceof TypeError) {
                    throw this.createIncorrectTypeError('window.Blob || base64 URL || undefined', value);
                }
            }
        }
    }

    toJSON() {
        return this.input.name;
    }
};