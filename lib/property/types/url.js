const ƒ_type = require('../index');

let URL;
try {
    if (window) URL = window.URL;
} catch (error) {
    if (global) URL = require('url');
}

module.exports = class ƒ_url extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, URL, input, options);
    }

    static evaluate(input, type) {
        return type === 'object' && input instanceof URL
            || type === 'function' && input === URL
        ;
    }

    static get priority() {
        return 3;
    }

    expose(property) {
        if (property.value === undefined) return property.value;
        return new URL(property.value);
    }

    flatten(value) {
        if (value === undefined) return value;
        if (typeof value === 'string') return value;
        return value.toString();
    }

    validate(value) {
        if (value === undefined) return;
        if (!(value instanceof this.generator) && typeof value !== 'string') {
            throw this.createIncorrectTypeError('URL || base64 || undefined', value);
        }
        if (typeof value === 'string') {
            try { new URL(value); } catch (error) {
                if (error instanceof TypeError) {
                    throw this.createIncorrectTypeError('Blob || base64 URL || undefined', value);
                }
            }
        }
    }

    toJSON() {
        return this.generator.name;
    }
};
