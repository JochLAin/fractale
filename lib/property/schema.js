const moment = require('moment');
const factory = require('../factory');
const library = require('../library');
const _ = require('../utils');
const Field = require('./field');

/**
 * Schema class
 *
 * @class Schema
 * @params {Model} model
 * @params {Object} props
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

    filter(params) {
        const keys = this.fields.map(field => field.key);
        const props = {};
        for (const key in params) {
            if (!params.hasOwnProperty(key)) continue;
            if (keys.includes(key)) continue;
            props[key] = params[key];
            delete params[key];
        }
        return props;
    }

    get(key, full = true) {
        const fields = !full ? this.fields : this.values;
        const field = fields.filter(field => !field.ƒ_regexp).find(field => field.match(key));
        if (field) return field;
        return fields.filter(field => field.ƒ_regexp).find(field => field.match(key));
    }

    has(key, full = true) {
        return !!this.get(key, full);
    }

    get fields() {
        if (this._fields) return this._fields;
        this._fields = [];
        for (const key in this.props) {
            if (!this.props.hasOwnProperty(key)) continue;
            const input = this.props[key] === null ? undefined : this.props[key];
            const kind = parseKind(this, key, input);
            const value = parseValue(this, key, kind, input);
            const options = parseOptions(input, {});
            this._fields.push(new Field(this, key, input, kind, value, options));
        }

        return this._fields;
    }

    get keys() {
        if (this._keys) return this._keys;
        return this._keys = this.values.map(field => field.key);
    }

    get values() {
        if (this._values) return this._values;
        if (!this.model.parent) return this._values = this.fields;
        return this._values = [].concat(this.model.parent.schema.values, this.fields);
    }

    get ƒ_schema() {
        return true;
    }

    toJSON() {
        return this.fields.reduce((accu, field) => {
            return Object.assign({}, accu, {
                [field.key]: field
            });
        }, {});
    }
};

const parseKind = (schema, key, value) => {
    const _typeof = typeof value;

    if (!Field.validate(value, _typeof)) {
        throw new Error(`Type ${(_typeof === 'function' && value.name) ? value.name : _typeof} is not processed`);
    } else if (value === null || value === undefined) {
        return 'ƒ_mixed';
    } else if (_typeof === 'boolean') {
        return 'ƒ_boolean';
    } else if (_typeof === 'number') {
        return 'ƒ_number';
    } else if (_typeof === 'string') {
        const _value = value.toLowerCase();
        if (_value === 'boolean') {
            return 'ƒ_boolean';
        } else if (_value === 'number') {
            return 'ƒ_number';
        } else if (_value === 'string') {
            return 'ƒ_string';
        } else if (_value === 'date') {
            return 'ƒ_date';
        } else if (_value === 'ƒ_self') {
            return 'ƒ_model';
        }
        return 'ƒ_string';
    } else if (_typeof === 'function') {
        if (value === Boolean) {
            return 'ƒ_boolean';
        } else if (value === Number) {
            return 'ƒ_number';
        } else if (value === String) {
            return 'ƒ_string';
        } else if ([Date, moment].includes(value)) {
            return 'ƒ_date';
        } else if (!value.prototype) {
            return 'ƒ_callback';
        } else if (value.hasOwnProperty('ƒ_model')) {
            return 'ƒ_model';
        }
    } else if (_typeof === 'object') {
        if (value.ƒ_entity) {
            return 'ƒ_model';
        } else if (value instanceof Date || moment.isMoment(value)) {
            return 'ƒ_date';
        } else if (value.hasOwnProperty('ƒ_kind')) {
            return parseKind(schema, key, value.ƒ_kind);
        } else if (Array.isArray(value)) {
            return [parseKind(schema, `${key}Item`, value[0])];
        }

        /* Auto-generate inter-model class with PascalCase name */
        if (!library.get(`${schema.classname}_${_.toPascalCase(key)}`)) {
            factory.createModel(`${schema.classname}_${_.toPascalCase(key)}`, value, { virtual: true });
        }
        return 'ƒ_model';
    }
    throw new Error(`Type ${(_typeof === 'function' && value.name) ? value.name : _typeof} is not processed`);
};

const parseOptions = (value, options = {}) => {
    const _typeof = typeof value;
    if (_typeof === 'object') {
        if (Array.isArray(value)) {
            return [parseOptions(value[0], options)];
        } else if (value.hasOwnProperty('ƒ_kind')) {
            if (value.hasOwnProperty('ƒ_options')) {
                let validator;
                if (value.ƒ_options.validator) {
                    validator = Object.assign({}, options.validator, value.ƒ_options.validator);
                }
                Object.assign(options, value.ƒ_options, { validator });
            }
            return parseOptions(value.ƒ_kind, options);
        }
    }
    return options;
};

const parseValue = (schema, key, kind, value) => {
    if (kind === 'ƒ_mixed') {
        return undefined;
    } else if (kind === 'ƒ_boolean') {
        return Boolean;
    } else if (kind === 'ƒ_number') {
        return Number;
    } else if (kind === 'ƒ_string') {
        return String;
    } else if (kind === 'ƒ_date') {
        return Date;
    } else if (kind === 'ƒ_model') {
        const _typeof = typeof value;
        if (_typeof === 'function' && value.ƒ_model) {
            return value;
        } else if (_typeof === 'string') {
            if (value === 'ƒ_self') {
                return library.get(schema.classname);
            }
            return library.get(`${schema.classname}_${_.toPascalCase(key)}`);
        } else if (_typeof === 'object') {
            if (value.ƒ_from) {
                library.get(value.ƒ_from);
            } else if (value.ƒ_entity) {
                return value.constructor;
            } else if (value.ƒ_kind) {
                return parseValue(schema, key, kind, value.ƒ_kind);
            }
            return library.get(`${schema.classname}_${_.toPascalCase(key)}`);
        }
    } else if (Array.isArray(value)) {
        return [parseValue(schema, `${key}Item`, kind[0], value[0])];
    }
    throw new Error(`Value of type ${kind} is not processed`);
};
