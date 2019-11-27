'use strict';

const uuid = require('uuid');
const { createIncorrectTypeError } = require('../../../errors');
const factory = require('../../../factory');
const library = require('../../../library');
const _ = require('../../../utils');
const ƒ_type = require('../base');

module.exports = class ƒ_model extends ƒ_type {
    constructor(field, input) {
        super(field, input);

        const _typeof = typeof input;
        if (_typeof === 'string' && this.input === 'ƒ_self') {
            this.value = library.get(this.field.schema.classname);
        } else if (_typeof === 'function') {
            this.value = input;
        } else if (_typeof === 'object') {
            if (this.input.ƒ_from) {
                this.value = library.get(this.input.ƒ_from);
            } else {
                const model = library.get(this.field.classname);
                if (!model) {
                    this.value = factory.createModel(this.field.classname, this.input, { virtual: true });
                } else {
                    this.value = model;
                }
             }
        }
    }

    static evaluate(input, type) {
        return type === 'string' && input === 'ƒ_self'
            || type === 'function' && input.hasOwnProperty('ƒ_model')
            || type === 'object'
        ;
    }

    static get priority() {
        return -1;
    }

    get(current) {
        const value = this.denormalize(current);
        if (!value) return;
        return this.value.memory.read(value);
    }

    normalize(next, current) {
        if (!next) return undefined;
        if (typeof next === 'string') return next;
        if (next.ƒ_entity) return next.uuid;
        const props = Object.assign({}, current && this.value.memory.read(current), next);
        return this.deserialize(props);
    }

    deserialize(value) {
        if (typeof value === 'string') return value;
        const props = _.deserialize(this.value, value);
        if (!props.uuid) {
            props.uuid = uuid.v4();
            this.value.memory.create(props);
        } else {
            this.value.memory.load(props);
        }
        return props.uuid;
    }

    /**
     * @param {String} value
     * @param {{recorded: Map,depth: Number,populate: *}} options
     * @returns {{uuid: *}|*}
     */
    serialize(value, options) {
        options.depth--;

        if (!value) return;
        if (!options.populate) return value;
        if (options.depth <= 0) return value;
        if (options.recorded.has(value)) {
            return options.recorded.get(value);
        }
        if (typeof options.populate === 'string' && !this.value.schema.keys.includes(options.populate)) {
            options.recorded.set(value, value);
            return value;
        }

        const props = typeof value === 'string' ? this.value.memory.read(value) : value;
        if (typeof options.populate === 'string') {
            const tmp = props[options.populate];
            options.recorded.set(value, tmp);
            return tmp;
        }
        if (typeof options.populate === 'function') {
            const tmp = options.populate(props, this.value, options);
            options.recorded.set(value, tmp);
            return tmp;
        }

        if (options.populate === true) {
            options.recorded.set(value, value);
            const serialized = { uuid: props.uuid };
            const fields = this.value.schema.values;
            for (let index = 0, length = fields.length; index < length; index++) {
                const field = fields[index];
                Object.assign(serialized, {
                    [field.key]: field.serialize(props[field.key], options),
                });
            }
            return serialized;
        }
        return value;
    }

    validate(value) {
        if (value !== undefined && typeof value !== 'string' && typeof value !== 'object') {
            throw createIncorrectTypeError(this.field, `${this.value.name} || uuid || undefined`, value);
        }
        ƒ_type.prototype.validate.call(this, value);
    }
};
