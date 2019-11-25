const moment = require('moment');
const { REGEXP_MATCH } = require('../constants');
const Type = require('./types');

const {
    FIELD_KIND_MIXED,
    FIELD_KIND_BOOLEAN,
    FIELD_KIND_STRING,
    FIELD_KIND_NUMBER,
    FIELD_KIND_DATE,
    FIELD_KIND_MODEL,
    FIELD_KIND_ARRAY,
    FIELD_KIND_CALLBACK,
} = require('../constants');

/**
 * @class Field
 * @params {Schema} schema
 * @params {String|RegExp} key
 * @params {*} input
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
const Field = module.exports = class Field {
    constructor(schema, key, input, kind, value, options = {}) {
        this.schema = schema;
        this.input = input;
        this.kind = kind;
        this.value = value;
        this.options = options;
        this.ƒ_array = Array.isArray(value);
        this.ƒ_field = true;

        const match = key.match(REGEXP_MATCH);
        if (!match) this.key = key;
        else {
            this.ƒ_regexp = true;
            this.key = new RegExp(match[1], match[2]);
        }

    }

    fork(key) {
        if (typeof key === 'number') key = `${this.key}[${key}]`;
        else if (typeof key === 'string') key = `${this.key}.${key}`;
        else if (!key) key = this.key;
        else throw new Error(`Key must be number or string, got ${typeof key}`);
        return new Field(this.schema, key, this.input[0], this.kind[0], this.value[0], this.options[0]);
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
        if (!this.ƒ_array) return this.type.normalize(this, next, current);
        const data = [];
        for (let index = 0, length = next.length; index < length; index++) {
            const subfield = this.fork(index);
            data.push(subfield.normalize(next[index]));
        }
        return data;
    }

    denormalize(next, current) {
        if (!this.ƒ_array) return this.type.denormalize(this, next, current);
        const data = [];
        for (let index = 0, length = next.length; index < length; index++) {
            const subfield = this.fork(index);
            data.push(subfield.denormalize(next[index]));
        }
        return data;
    }

    serialize(value, options = {}) {
        if (!this.ƒ_array) return this.type.serialize(this, value, options);
        if (!value) return [];
        options = Object.assign({}, options, { depth: options.depth - 1 });
        const data = [];
        for (let index = 0, length = value.length; index < length; index++) {
            const subfield = this.fork(index);
            data.push(subfield.serialize(value[index], options));
        }
        return data;
    }

    deserialize(value) {
        if (!this.ƒ_array) return this.type.deserialize(this, value);
        if (!value) return [];
        const data = [];
        for (let index = 0, length = value.length; index < length; index++) {
            const subfield = this.fork(index);
            data.push(subfield.deserialize(value[index]));
        }
        return data;
    }

    set(next, current) {
        if (!this.ƒ_array) {
            this.type.validate(this, next);
            return this.type.normalize(this, next, current);
        }
        if (!next) return [];
        const data = [];
        for (let index = 0, length = next.length; index < length; index++) {
            const subfield = this.fork(index);
            subfield.validate(next[index]);
            data.push(subfield.normalize(next[index], undefined));
        }
        return data;
    }

    get(current) {
        if (!this.ƒ_array) return this.type.get(this, current);
        if (!current) return [];
        const data = [];
        for (let index = 0, length = current.length; index < length; index++) {
            const subfield = this.fork(index);
            data.push(subfield.get(current[index]));
        }
        return data;
    }

    validate(value) {
        if (!this.ƒ_array) {
            return this.type.validate(this, value);
        }
        if (!value) return;
        if (!Array.isArray(value)) {
            throw new Error('Expected array');
        }
        for (let index = 0, length = value.length; index < length; index++) {
            this.fork(index).validate(value[index]);
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
            case FIELD_KIND_MIXED:
                return 'undefined';
            case FIELD_KIND_BOOLEAN:
                return 'Boolean';
            case FIELD_KIND_NUMBER:
                return 'Number';
            case FIELD_KIND_STRING:
                return 'String';
            case FIELD_KIND_DATE:
                return 'Date';
            case FIELD_KIND_MODEL:
                if (typeof this.input === 'string' && this.input === 'ƒ_self') {
                    return 'Fractale.SELF';
                } else if (this.value.virtual) {
                    return this.value.schema.toJSON();
                }
                return this.value.name;
            case FIELD_KIND_ARRAY:
                return [this.options.this.subfield];
        }
        return this.value || 'undefined';
    }
};

Field.KIND_MIXED = FIELD_KIND_MIXED;
Field.KIND_BOOLEAN = FIELD_KIND_BOOLEAN;
Field.KIND_STRING = FIELD_KIND_STRING;
Field.KIND_NUMBER = FIELD_KIND_NUMBER;
Field.KIND_DATE = FIELD_KIND_DATE;
Field.KIND_MODEL = FIELD_KIND_MODEL;
Field.KIND_ARRAY = FIELD_KIND_ARRAY;
Field.KIND_CALLBACK = FIELD_KIND_CALLBACK;
