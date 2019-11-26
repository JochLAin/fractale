'use strict';

const uuid = require('uuid');
const { createIncorrectTypeError } = require('../../errors');
const _ = require('../../utils');
const MixedType = require('./mixed');

module.exports = class ModelType extends MixedType {
    static get(field, current) {
        const value = field.denormalize(current);
        if (!value) return;
        return field.value.memory.read(value);
    }

    static normalize(field, next, current) {
        if (!next) return undefined;
        if (typeof next === 'string') return next;
        const memory = field.value.memory;

        const props = next.ƒ_uuid ? next : Object.assign({}, current && memory.read(current), next);
        return field.deserialize(props);
    }

    static deserialize(field, value) {
        if (typeof value === 'string') return value;
        const props = _.deserialize(field.value, value);
        if (!props.uuid) {
            props.uuid = uuid.v4();
            field.value.memory.create(props);
        } else {
            field.value.memory.load(props);
        }

        return props.uuid;
    }

    /**
     *
     * @param {Field} field
     * @param {String} value
     * @param {{recorded: Map,depth: Number,populate: *}} options
     * @returns {{uuid: *}|*}
     */
    static serialize(field, value, options) {
        options.depth--;

        if (!value) return;
        if (!options.populate) return value;
        if (options.depth <= 0) return value;
        if (options.recorded.has(value)) {
            return options.recorded.get(value);
        }
        if (typeof options.populate === 'string' && !field.value.schema.keys.includes(options.populate)) {
            options.recorded.set(value, value);
            return value;
        }

        const props = typeof value === 'string' ? field.value.memory.read(value) : value;
        if (typeof options.populate === 'string') {
            const tmp = props[options.populate];
            options.recorded.set(value, tmp);
            return tmp;
        }
        if (typeof options.populate === 'function') {
            const tmp = options.populate(props, field.value, options);
            options.recorded.set(value, tmp);
            return tmp;
        }

        if (options.populate === true) {
            options.recorded.set(value, value);
            const serialized = { uuid: props.uuid };
            const fields = field.value.schema.values;
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

    static validate(field, value) {
        if (value !== undefined && typeof value !== 'string' && typeof value !== 'object') {
            throw createIncorrectTypeError(field,  `${field.value.name} || uuid || undefined`, value);
        }
        MixedType.validate(field, value);
    }
};
