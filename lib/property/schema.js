const TYPES = require('./types');

/**
 * Specific error for incorrect schema
 *
 * @class SchemaError
 * @extends Error
 */
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
 * @param {Model} model - Model attached to this schema
 * @param {Object} props - Schema object
 * @property {String} classname - Model name
 * @property {Array<String>} keys - Schema keys
 * @property {Array<PropertyType>} fields - fields for this schema
 * @property {Array<PropertyType>} values - fields for this extended schema
 * @property {Object} default - Properties default values
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
class Schema {
    constructor(model, props) {
        if (props.uuid) {
            throw new Error('Field "uuid" is automatically set');
        }

        this.model = model;
        this.props = props;
        this.classname = this.model.name;
    }

    /**
     * Evaluate what kind of property the input is
     *
     * @param {String} key
     * @param {*} input
     * @param {Object} options
     * @return {PropertyType}
     * @throws SchemaError
     */
    evaluate(key, input, options = {}) {
        const _typeof = typeof input;
        if (typeof key === 'string') {
            const match = key.match(/^\/(.+)\/([gmixXsuUAJD]*)?$/);
            if (match) return this.evaluate(new RegExp(match[1], match[2]), input, options);
        }
        if (_typeof === 'object' && input && Object.prototype.hasOwnProperty.call(input, 'ƒ_type')) {
            if (Object.prototype.hasOwnProperty.call(input, 'ƒ_options')) {
                if (Object.prototype.hasOwnProperty.call(input.ƒ_options, 'validator')) {
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

    /**
     * Get the PropertyType that match the key
     *
     * @param {String} key
     * @param {Boolean} full - Search on schema fields or extended fields
     * @return {PropertyType|undefined}
     */
    get(key, full = true) {
        for (let index = 0, types = !full ? this.types : this.values, length = types.length; index < length; index++) {
            if (types[index].match(key)) return types[index];
        }
    }

    /**
     * Search for PropertyType that match the key
     *
     * @param {String} key
     * @param {Boolean} full - Search on schema fields or extended fields
     * @return {boolean}
     */
    has(key, full = true) {
        for (let index = 0, types = !full ? this.types : this.values, length = types.length; index < length; index++) {
            if (types[index].match(key)) return true;
        }
        return false;
    }

    /**
     * Validate a object for this schema
     *
     * @param {Object} props
     * @throws ValidatorError
     */
    validate(props) {
        for (let idx = 0, keys = Object.keys(props); idx < keys.length; idx++) {
            const type = this.get(keys[idx]);
            if (type) type.validate(props[keys[idx]]);
        }
        const types = this.values.filter(type => type.options.required);
        const keys = Object.keys(props);
        const type = types.find(type => !keys.some(key => type.match(key)));
        if (type) throw type.createValidatorError('required', undefined, 'to be define');
    }

    get default() {
        if (this._default) return this._default;
        return this._default = this.types.reduce((accu, type) => {
            if (type.options.default === undefined) return accu;
            return Object.assign({}, accu, { [type.key]: type.options.default });
        }, {});
    }

    get keys() {
        if (this._keys) return this._keys;
        return this._keys = this.values.map(type => type.key);
    }

    get types() {
        if (this._types) return this._types;
        this._types = [];
        for (const key in this.props) {
            if (!Object.prototype.hasOwnProperty.call(this.props, key)) continue;
            this._types.push(this.evaluate(key, this.props[key]));
        }

        return this._types;
    }

    get values() {
        if (this._values) return this._values;
        if (!this.model.parent) return this._values = this.types;
        return this._values = [].concat(
            this.model.parent.schema.values,
            this.types
        );
    }

    toBasic(replacer) {
        return this.values.reduce((accu, type) => {
            return Object.assign({}, accu, {
                [type.key]: type.toBasic(replacer),
            });
        }, {});
    }

    toJSON() {
        return this.types.reduce((accu, type) => {
            return Object.assign({}, accu, {
                [type.key]: type
            });
        }, {});
    }
}

module.exports = Schema;
