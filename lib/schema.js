const moment = require('moment');
const CONSTANTS = require('./constants');
const library = require('./library');
const models = require('./model');
const _ = require('./utils');

/**
 * Schema class
 * @class Schema
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
class Schema {
    static validate(type, _typeof) {
        const Model = models.get();
        if (type === undefined || type === null) return true;
        if (!_typeof) _typeof = typeof type;
        if (['string', 'number', 'boolean', 'object'].includes(_typeof)) return true;
        if (_typeof === 'function') {
            if ([Boolean, Number, String, Date, moment].includes(type)) return true;
            if (!type.prototype) return true;
            if (type.prototype instanceof Model || type instanceof Schema) return true;
        }
        throw new Error(`Type ${(_typeof === 'function' && type.name) ? type.name : _typeof} is not processed`);
    }

    constructor(name, props = {}, parent) {
        if (props.uuid) {
            throw new Error('Field "uuid" is automatically set');
        }

        this.name = name;
        this._parent = parent;
        this.fields = Object.entries(props).map(([key, type]) => this.createField(key, type));
        if (!this._parent) this.values = this.fields;
        else this.values = [].concat(this._parent.values, this.fields);
        this.keys = this.values.map(field => field.key);
    }

    createField(key, type) {
        const field = new Field(this, key);
        return this.parse(field, type);
    }

    parse(field, type, options = {}) {
        const Model = models.get();
        const _typeof = typeof type;
        if (!Schema.validate(type, _typeof)) {
            throw new Error(`Type ${(_typeof === 'function' && type.name) ? type.name : _typeof} is not processed`);
        }
        if (type === null || type === undefined) {
            return field.specify(Field.TYPE_MIXED, undefined, options);
        }
        switch (_typeof) {
            case 'boolean':
                return field.specify(Field.TYPE_BOOLEAN, Boolean, options);
            case 'number':
                return field.specify(Field.TYPE_NUMBER, Number, options);
            case 'string':
                switch (type.toLowerCase()) {
                    case 'boolean':
                        return field.specify(Field.TYPE_BOOLEAN, Boolean, options);
                    case 'number':
                        return field.specify(Field.TYPE_NUMBER, Number, options);
                    case 'string':
                        return field.specify(Field.TYPE_STRING, String, options);
                    case CONSTANTS.SELF.toLowerCase():
                        return field.specify(Field.TYPE_CALLBACK, () => library.get(this.name), options);
                    default: {
                        return field.specify(Field.TYPE_STRING, String, options);
                    }
                }
            case 'object':
                if (type instanceof Date || moment.isMoment(type)) {
                    return field.specify(Field.TYPE_DATE, Date, options);
                }
                if (type.hasOwnProperty(CONSTANTS.TYPE_KEY)) {
                    Object.assign(options, type[CONSTANTS.OPTIONS_KEY]);
                    return this.parse(field, type[CONSTANTS.TYPE_KEY], options);
                }
                if (Array.isArray(type)) {
                    Object.assign(options, { subfield: this.createField(field.key, type[0]) });
                    return field.specify(Field.TYPE_ARRAY, type, options);
                }
                /* Auto-generate inter-model class with PascalCase name */
                const subname = `${this.name}_${_.toPascalCase(field.key)}`;
                let entity = require('./library').get(subname);
                if (!entity) entity = require('./factory').createModel(subname, type, { virtual: true });
                return field.specify(Field.TYPE_MODEL, entity, options);
            case 'function': {
                switch (type) {
                    case Boolean:
                        return field.specify(Field.TYPE_BOOLEAN, Boolean, options);
                    case Number:
                        return field.specify(Field.TYPE_NUMBER, Number, options);
                    case String:
                        return field.specify(Field.TYPE_STRING, String, options);
                    case Date: case moment:
                        return field.specify(Field.TYPE_DATE, Date, options);
                    default: {
                        if (!type.prototype) {
                            return field.specify(Field.TYPE_CALLBACK, type, options);
                        } else if (type.prototype instanceof Model) {
                            return field.specify(Field.TYPE_MODEL, type.entity, options);
                        }
                    }
                }
            }
        }
        throw new Error(`Type ${(_typeof === 'function' && type.name) ? type.name : _typeof} is not processed`);
    }

    toJSON() {
        return this.fields.reduce((accu, field) => {
            return Object.assign({}, accu, {
                [field.key]: field
            });
        }, {});
    }

    get parent() {
        if (!this._parent) return;
        return library.get(this._parent.name);
    }
}

class Field {
    constructor(schema, key) {
        this.schema = schema;
        this.key = key;
        this.type = undefined;
        this.value = undefined;
        this.options = {};
        this.subfield = undefined;
    }

    specify(type, value, options) {
        this.type = type;
        this.value = value;
        this.setOptions(options);
        return this;
    }

    setOptions(options = {}) {
        Object.assign(this.options, options, {
            validator: Object.assign({}, this.options.validator, options.validator),
        });
    }

    toJSON() {
        switch (this.type) {
            case CONSTANTS.FIELD_TYPE_MIXED:
            case CONSTANTS.FIELD_TYPE_BOOLEAN:
            case CONSTANTS.FIELD_TYPE_NUMBER:
            case CONSTANTS.FIELD_TYPE_STRING:
            case CONSTANTS.FIELD_TYPE_DATE:
                return this.type;
            case CONSTANTS.FIELD_TYPE_MODEL:
                if (this.value.name === this.schema.name) {
                    return `Fractale.SELF`;
                }
                if (this.value.virtual) {
                    return this.value.schema.toJSON();
                }
                return this.value.name;
            case CONSTANTS.FIELD_TYPE_ARRAY:
                return [this.options.subfield];
        }
    }
}

module.exports = Schema;
Schema.Field = Field;
Field.TYPE_MIXED = CONSTANTS.FIELD_TYPE_MIXED;
Field.TYPE_BOOLEAN = CONSTANTS.FIELD_TYPE_BOOLEAN;
Field.TYPE_STRING = CONSTANTS.FIELD_TYPE_STRING;
Field.TYPE_NUMBER = CONSTANTS.FIELD_TYPE_NUMBER;
Field.TYPE_DATE = CONSTANTS.FIELD_TYPE_DATE;
Field.TYPE_MODEL = CONSTANTS.FIELD_TYPE_MODEL;
Field.TYPE_ARRAY = CONSTANTS.FIELD_TYPE_ARRAY;
Field.TYPE_CALLBACK = CONSTANTS.FIELD_TYPE_CALLBACK;
