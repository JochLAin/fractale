'use strict';

const TYPES = require('./types');

class SchemaError extends Error {
    constructor(schema, key, input, options) {
        super();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SchemaError);
        }
        this.name = 'SchemaError';
        this.schema = schema;
        this.key = key;
        this.input = input;
        this.options = options;
        this.message = `Type ${input instanceof Function ? input.name : typeof input} is not processed`;
    }
}

/**
 * @class Schema
 * @param {Model} model
 * @param {Object} props
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class Schema {
    constructor(model, props) {
        if (props.uuid) {
            throw new Error('Field "uuid" is automatically set');
        }

        this.model = model;
        this.props = props;
        this.classname = this.model.name;
    }

    evaluate(key, input, options = {}) {
        const _typeof = typeof input;
        if (typeof key === 'string') {
            const match = key.match(/^\/(.+)\/([gmixXsuUAJD]*)?$/);
            if (match) return this.evaluate(new RegExp(match[1], match[2]), input, options);
        }
        if (_typeof === 'object' && input && input.hasOwnProperty('ƒ_type')) {
            if (input.hasOwnProperty('ƒ_options')) {
                if (input.ƒ_options.hasOwnProperty('validator')) {
                    Object.assign(input.ƒ_options, { validator: Object.assign({}, options.validator, input.ƒ_options.validator) });
                }
                Object.assign(options, input.ƒ_options);
            }
            return this.evaluate(key, input.ƒ_type, options);
        }
        for (let index = 0, types = TYPES.get(), length = types.length; index < length; index++) {
            if (types[index].evaluate(input, _typeof)) {
                return new types[index](this, key, input, options);
            }
        }
        throw new SchemaError(this, key, input, options);
    }

    get(key, full = true) {
        for (let index = 0, types = !full ? this.types : this.values, length = types.length; index < length; index++) {
            if (types[index].match(key)) return types[index];
        }
    }

    get types() {
        if (this._types) return this._types;
        this._types = [];
        for (const key in this.props) {
            if (!this.props.hasOwnProperty(key)) continue;
            this._types.push(this.evaluate(key, this.props[key]));
        }

        return this._types;
    }

    get keys() {
        if (this._keys) return this._keys;
        return this._keys = this.values.map(type => type.key);
    }

    get values() {
        if (this._values) return this._values;
        if (!this.model.parent) return this._values = this.types;
        return this._values = [].concat(
            this.model.parent.schema.values,
            this.types
        );
    }

    toJSON() {
        return this.types.reduce((accu, type) => {
            return Object.assign({}, accu, {
                [type.key]: type
            });
        }, {});
    }
};

const parseOptions = (input, options = {}) => {
    if (typeof input === 'object' && input !== null) {
        if (input.hasOwnProperty('ƒ_type')) {
            if (input.hasOwnProperty('ƒ_options')) {
                let validator;
                if (input.ƒ_options.validator) {
                    validator = Object.assign({}, options.validator, input.ƒ_options.validator);
                }
                Object.assign(options, input.ƒ_options, { validator });
            }
            return parseOptions(input.ƒ_type, options);
        }
    }
    return options;
};
