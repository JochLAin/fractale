'use strict';

const moment = require('moment');
const Type = require('./types');

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
    static create(schema, key, input, kind, value, options = {}) {
        return new Field(schema, key, input, kind, value, options);
    }

    constructor(schema, key, input, kind, value, options = {}) {
        const match = key.match(/^\/(.+)\/([gmixXsuUAJD]+)?$/);

        this.schema = schema;
        this.input = input;
        this.key = !match ? key : new RegExp(match[1], match[2]);
        this.kind = kind;
        this.value = value;
        this.options = options;

        this.ƒ_array = Array.isArray(value);
        this.ƒ_regexp = !!match;
        this.ƒ_field = true;
    }

    fork(key) {
        let input, kind, value, options;

        const _typeof = typeof key;
        if (this.ƒ_array && _typeof === 'number') {
            key = `${this.key}[${key}]`;
            input = this.input[0];
            kind = this.kind[0];
            value = this.value[0];
            options = this.options[0];
        } else if (this.ƒ_regexp && _typeof === 'string') {
            input = this.input;
            kind = this.kind;
            value = this.value;
            options = this.options;
        } else {
            throw new Error(`Key must be number or string, got ${_typeof}`);
        }

        return new Field(this.schema, key, input, kind, value, options);
    }

    is(kind) {
        return this.kind === kind;
    }

    match(key) {
        if (this.ƒ_regexp) {
            if (key instanceof RegExp) key = key.toString();
            if (this.key.toString() === key) return true;
            return !!key.match(this.key);
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

    get type() {
        if (this._type) return this._type;
        return this._type = Type.get(this);
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
