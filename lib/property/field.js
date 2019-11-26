'use strict';

const moment = require('moment');
const factory = require('../factory');
const library = require('../library');
const PropertyType = require('./types');
const _ = require('../utils');

/**
 * @class Field
 * @param {Schema} schema
 * @param {String|RegExp} key
 * @param {*} input
 * @param {String} kind
 * @param {*} value
 * @param {Object} options
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
const Field = module.exports = class Field {
    static create(schema, key, input, opts = {}) {
        const closure = (key, input, options) => {
            if (Array.isArray(input)) {
                return closure(key, input[0], Object.assign(options, {
                    compound: options.compound ? options.compound++ : 1
                }));
            }
            input = input === null ? undefined : input;
            const kind = parseKind(schema, key, input);
            const type = parseType(kind);
            const value = parseValue(schema, key, kind, input);
            options = parseOptions(input, options);
            return { kind, value, type, options };
        };

        const { kind, type, value, options } = closure(key, input, opts);
        return new Field(schema, key, input, kind, type, value, options);
    }

    constructor(schema, key, input, kind, type, value, options = {}) {
        const match = key.match(/^\/(.+)\/([gmixXsuUAJD]+)?$/);

        this.schema = schema;
        this.input = input;
        this.key = !match ? key : new RegExp(match[1], match[2]);
        this.kind = kind;
        this.value = value;
        this.type = type;
        this.options = options;

        this.ƒ_array = !!options.compound;
        this.ƒ_regexp = !!match;
    }

    fork(key) {
        const _typeof = typeof key;
        if (!(this.ƒ_regexp && _typeof === 'string')
         && !(this.ƒ_array && _typeof === 'number')) {
            throw new Error(`Key must be number or string, got ${_typeof}`);
        }

        let input = this.input, options = this.options;
        if (this.ƒ_array && _typeof === 'number') {
            key = `${this.key}[${key}]`;
            input = this.input[0];
            options = Object.assign({}, options, { compound: options.compound - 1 });
        }

        return new Field(this.schema, key, input, this.kind, this.type, this.value, options);
    }

    is(kind) {
        return this.kind === kind;
    }

    match(key) {
        if (this.ƒ_regexp) {
            if (key instanceof RegExp) key = key.toString();
            if (this.key.toString() === key) return true;
            return this.key.test(key);
        }
        return this.key === key;
    }

    normalize(next, current) {
        if (this.ƒ_regexp) {
            const data = {};
            for (let index = 0, keys = Object.keys(next), length = keys.length; index < length; index++) {
                const subfield = this.fork(keys[index]);
                Object.assign(data, {
                    [keys[index]]: subfield.normalize(next[keys[index]], current && current[keys[index]])
                });
            }
            return data;
        } else if (this.ƒ_array) {
            const data = [];
            for (let index = 0, length = next.length; index < length; index++) {
                const subfield = this.fork(index);
                data.push(subfield.normalize(next[index]));
            }
            return data;
        }
        return this.type.normalize(this, next, current);
    }

    denormalize(next, current) {
        if (this.ƒ_regexp) {
            const data = {};
            for (let index = 0, keys = Object.keys(next), length = keys.length; index < length; index++) {
                const subfield = this.fork(keys[index]);
                Object.assign(data, {
                    [keys[index]]: subfield.denormalize(next[keys[index]])
                });
            }
            return data;
        } else if (this.ƒ_array) {
            const data = [];
            for (let index = 0, length = next.length; index < length; index++) {
                const subfield = this.fork(index);
                data.push(subfield.denormalize(next[index]));
            }
            return data;
        }
        return this.type.denormalize(this, next, current);
    }

    serialize(value, options) {
        if (this.ƒ_regexp) {
            const data = {};
            for (let index = 0, keys = Object.keys(value), length = keys.length; index < length; index++) {
                const subfield = this.fork(keys[index]);
                Object.assign(data, {
                    [keys[index]]: subfield.serialize(value[keys[index]])
                });
            }
            return data;
        } else if (this.ƒ_array) {
            if (!value) return [];
            options.depth--;
            const data = [];
            for (let index = 0, length = value.length; index < length; index++) {
                const subfield = this.fork(index);
                data.push(subfield.serialize(value[index], options));
            }
            return data;
        }
        return this.type.serialize(this, value, options);
    }

    deserialize(value) {
        if (this.ƒ_regexp) {
            const data = {};
            for (let index = 0, keys = Object.keys(value), length = keys.length; index < length; index++) {
                const subfield = this.fork(keys[index]);
                Object.assign(data, {
                    [keys[index]]: subfield.deserialize(value[keys[index]])
                });
            }
            return data;
        } else if (this.ƒ_array) {
            if (!value) return [];
            const data = [];
            for (let index = 0, length = value.length; index < length; index++) {
                const subfield = this.fork(index);
                data.push(subfield.deserialize(value[index]));
            }
            return data;
        }
        return this.type.deserialize(this, value);
    }

    format(next, current) {
        if (this.ƒ_regexp) {
            const data = {};
            for (let index = 0, keys = Object.keys(next), length = keys.length; index < length; index++) {
                const subfield = this.fork(keys[index]);
                subfield.validate(next[keys[index]]);
                Object.assign(data, {
                    [keys[index]]: subfield.normalize(next[keys[index]], current && current[keys[index]])
                });
            }
            return data;
        } else if (this.ƒ_array) {
            if (!next) return [];
            const data = [];
            for (let index = 0, length = next.length; index < length; index++) {
                const subfield = this.fork(index);
                subfield.validate(next[index]);
                data.push(subfield.normalize(next[index], undefined));
            }
            return data;
        }
        this.type.validate(this, next);
        return this.type.normalize(this, next, current);
    }

    get(current) {
        if (this.ƒ_regexp) {
            const data = {};
            for (let index = 0, keys = Object.keys(current), length = keys.length; index < length; index++) {
                const subfield = this.fork(keys[index]);
                Object.assign(data, {
                    [keys[index]]: subfield.get(current[keys[index]])
                });
            }
            return data;
        } if (this.ƒ_array) {
            if (!current) return [];
            const data = [];
            for (let index = 0, length = current.length; index < length; index++) {
                const subfield = this.fork(index);
                data.push(subfield.get(current[index]));
            }
            return data;
        }
        return this.type.get(this, current);
    }

    validate(value) {
        if (this.ƒ_regexp) {
            if (typeof value !== 'object') {
                throw new Error('Expected object for regexp key field');
            }
            for (let index = 0, keys = Object.keys(value), length = keys.length; index < length; index++) {
                const subfield = this.fork(keys[index]);
                subfield.validate(value[keys[index]]);
            }
        } else if (this.ƒ_array) {
            if (!value) return;
            if (!Array.isArray(value)) {
                throw new Error('Expected array');
            }
            for (let index = 0, length = value.length; index < length; index++) {
                this.fork(index).validate(value[index]);
            }
        } else {
            this.type.validate(this, value);
        }
    }

    get classname() {
        if (this._classname) return this._classname;
        return this._classname = `${this.schema.classname}_${_.toPascalCase(this.key)}`;
    }

    static validate(type, _typeof) {
        if (type === undefined || type === null) return true;
        if (!_typeof) _typeof = typeof type;
        if (['string', 'number', 'boolean', 'object'].includes(_typeof)) return true;
        if (_typeof === 'function') {
            if ([Boolean, Number, String, Date, moment].includes(type)) return true;
            if (!type.prototype) return true;
            if (type.ƒ_model) return true;
        }
        throw new Error(`Type ${(_typeof === 'function' && type.name) ? type.name : _typeof} is not processed`);
    }

    toJSON() {
        if (this.ƒ_array) {
            return [this.fork(0).toJSON()];
        }
        switch (this.kind) {
            case 'ƒ_mixed':
                return 'undefined';
            case 'ƒ_boolean':
                return 'Boolean';
            case 'ƒ_number':
                return 'Number';
            case 'ƒ_string':
                return 'String';
            case 'ƒ_date':
                return 'Date';
            case 'ƒ_model':
                if (typeof this.input === 'string' && this.input === 'ƒ_self') {
                    return 'Fractale.SELF';
                } else if (this.value.virtual) {
                    return this.value.schema.toJSON();
                }
                return this.value.name;
            case 'ƒ_array':
                return [this.fork(0)];
        }
        return this.value || 'undefined';
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
        if (value.hasOwnProperty('ƒ_kind')) {
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

const parseType = (kind, value) => {
    const closure = (kind) => {
        switch (kind) {
            case 'ƒ_mixed':
                return PropertyType.MixedType;
            case 'ƒ_boolean':
                return PropertyType.BooleanType;
            case 'ƒ_number':
                return PropertyType.NumberType;
            case 'ƒ_string':
                return PropertyType.StringType;
            case 'ƒ_date':
                return PropertyType.DateType;
            case 'ƒ_model':
                return PropertyType.ModelType;
            default:
                return PropertyType.MixedType;
        }
    };
    return closure(kind);
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
                return library.get(value.ƒ_from);
            } else if (value.ƒ_entity) {
                return value.constructor;
            } else if (value.ƒ_kind) {
                return parseValue(schema, key, kind, value.ƒ_kind);
            }
            return library.get(`${schema.classname}_${_.toPascalCase(key)}`);
        }
    }
    throw new Error(`Value of type ${kind} is not processed`);
};
