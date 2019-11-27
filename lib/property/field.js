'use strict';

const moment = require('moment');
const _ = require('../utils');
const TYPES = require('./types');

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
        const closure = (input) => {
            input = input === null ? undefined : input;
            const PropertyType = Field.evaluate(input);
            return new PropertyType(input);
        };

        const type = closure(input);
        return new Field(schema, key, type, parseOptions(input));
    }

    static evaluate(value) {
        const _typeof = typeof value;
        if (_typeof === 'object' && value.hasOwnProperty('ƒ_kind')) {
            return Field.evaluate(value.ƒ_kind, typeof value.ƒ_kind);
        }
        for (let index = 0, types = TYPES.get(), length = types.length; index < length; index++) {
            if (types[index].evaluate(value, _typeof)) return type;
        }
        throw new Error(`Type ${(_typeof === 'function' && value.name) ? value.name : _typeof} is not processed`);
    }

    constructor(schema, key, type, options = {}) {
        const match = key.match(/^\/(.+)\/([gmixXsuUAJD]+)?$/);

        this.schema = schema;
        this.key = !match ? key : new RegExp(match[1], match[2]);
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
