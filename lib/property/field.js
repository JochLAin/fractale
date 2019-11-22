const moment = require('moment');
const library = require('../library');
const _ = require('../utils');
const Normalizer = require('./normalizers');
const Property = require('./index');
const Serializer = require('./serializers');
const Validator = require('./validators');

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

const Field = module.exports = class Field {
    constructor(schema, key, input) {
        this.schema = schema;
        this.key = key;
        this.input = input;
    }

    instantiate(instance, value) {
        const property = new Property(instance, this);
        property.set(value);
        return property;
    }

    normalize(...args) {
        return this.normalizer.normalize(this, ...args);
    }

    denormalize(...args) {
        return this.normalizer.denormalize(this, ...args);
    }

    serialize(...args) {
        return this.serializer.serialize(this, ...args);
    }

    deserialize(...args) {
        return this.serializer.deserialize(this, ...args);
    }

    validate(...args) {
        return this.validator.validate(this, ...args);
    }

    get classname() {
        if (this._classname) return this._classname;
        return this._classname = `${this.schema.classname}_${_.toPascalCase(this.key)}`;
    }

    get kind() {
        if (this._kind) return this._kind;
        return this._kind = Field.parseKind(this, this.input);
    }

    get normalizer() {
        if (this._normalizer) return this._normalizer;
        return this._normalizer = Normalizer.get(this);
    }

    get options() {
        if (this._options) return this._options;
        return this._options = Field.parseOptions(this, this.input);
    }

    get serializer() {
        if (this._serializer) return this._serializer;
        return this._serializer = Serializer.get(this);
    }

    get validator() {
        if (this._validator) return this._validator;
        return this._validator = Validator.get(this);
    }

    get value() {
        if (this._value) return this._value;
        return this._value = Field.parseValue(this, this.input);
    }

    static parseKind(field, value) {
        const _typeof = typeof value;

        if (!Field.validate(value, _typeof)) {
            throw new Error(`Type ${(_typeof === 'function' && value.name) ? value.name : _typeof} is not processed`);
        } else if (value === null || value === undefined) {
            return Field.KIND_MIXED;
        } else if (_typeof === 'boolean') {
            return Field.KIND_BOOLEAN;
        } else if (_typeof === 'number') {
            return Field.KIND_NUMBER;
        } else if (_typeof === 'string') {
            const _value = value.toLowerCase();
            if (_value === 'boolean') {
                return Field.KIND_BOOLEAN;
            } else if (_value === 'number') {
                return Field.KIND_NUMBER;
            } else if (_value === 'string') {
                return Field.KIND_STRING;
            } else if (_value === 'date') {
                return Field.KIND_DATE;
            } else if (_value === 'ƒ_self') {
                return Field.KIND_MODEL;
            }
            return Field.KIND_STRING;
        } else if (_typeof === 'function') {
            if (value === Boolean) {
                return Field.KIND_BOOLEAN;
            } else if (value === Number) {
                return Field.KIND_NUMBER;
            } else if (value === String) {
                return Field.KIND_STRING;
            } else if ([Date, moment].includes(value)) {
                return Field.KIND_DATE;
            } else if (!value.prototype) {
                return Field.KIND_CALLBACK;
            } else if (value.hasOwnProperty('ƒ_model')) {
                return Field.KIND_MODEL;
            }
        } else if (_typeof === 'object') {
            if (value.ƒ_entity) {
                return Field.KIND_MODEL;
            } else if (value instanceof Date || moment.isMoment(value)) {
                return Field.KIND_DATE;
            } else if (value.hasOwnProperty('ƒ_kind')) {
                return Field.parseKind(field, value.ƒ_kind);
            } else if (Array.isArray(value)) {
                return Field.KIND_ARRAY;
            }

            /* Auto-generate inter-model class with PascalCase name */
            if (!library.get(field.classname)) {
                field.schema.factory.createModel(field.classname, value, { virtual: true });
            }
            return Field.KIND_MODEL;
        }
        throw new Error(`Type ${(_typeof === 'function' && value.name) ? value.name : _typeof} is not processed`);
    }

    static parseOptions(field, value, options = {}) {
        const _typeof = typeof value;
        if (_typeof === 'object') {
            if (value.hasOwnProperty('ƒ_kind')) {
                if (value.hasOwnProperty('ƒ_options')) {
                    Object.assign(options, value.ƒ_options, {
                        validator: Object.assign(
                            {},
                            options.validator,
                            value.ƒ_options.validator
                        ),
                    });
                }
                return Field.parseOptions(field, value.ƒ_kind, options);
            } else if (Array.isArray(value)) {
                Object.assign(options, {
                    subfield: new SubField(field.schema, field.key, value[0]),
                });
                return options;
            }
        }
        return options;
    }

    static parseValue(field, value) {
        if (field.kind === FIELD_KIND_MIXED) {
            return undefined;
        } else if (field.kind === FIELD_KIND_BOOLEAN) {
            return Boolean;
        } else if (field.kind === FIELD_KIND_NUMBER) {
            return Number;
        } else if (field.kind === FIELD_KIND_STRING) {
            return String;
        } else if (field.kind === FIELD_KIND_DATE) {
            return Date;
        } else if (field.kind === FIELD_KIND_MODEL) {
            const _typeof = typeof value;
            if (_typeof === 'function' && value.ƒ_model) {
                return value;
            } else if (_typeof === 'string') {
                if (value === 'ƒ_self') {
                    return library.get(field.schema.classname);
                }
                return library.get(field.classname);
            } else if (_typeof === 'object') {
                if (value.ƒ_entity) {
                    return value.constructor;
                } else if (value.ƒ_kind) {
                    return Field.parseValue(field, value.ƒ_kind);
                }
                return library.get(field.classname);
            }
        } else if (field.kind === FIELD_KIND_ARRAY) {
            return value;
        }
        throw new Error(`Value of type ${field.kind} is not processed`);
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
                return [this.options.subfield];
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

const SubField = module.exports.Subfield = class SubField extends Field {
    instantiate(instance, value, index) {
        const subproperty = new Property.SubProperty(instance, this, index);
        subproperty.set(value);
        return subproperty;
    }
};
