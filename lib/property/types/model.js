const uuid = require('uuid');
const MixedType = require('./mixed');

module.exports = class ModelType extends MixedType {
    static get(property) {
        const value = property.denormalize(property.value);
        if (!value) return;
        const props = property.field.value.memory.read(value);
        if (property.options.through) {
            const through = property.options.through;
            for (let index = 0, length = through.length; index < length; index++) {
                const key = property.options.through[index];
                props[key] = property.instance.get(key);
            }
        }
        if (!props) return;
        const item = new property.field.value.proxy(props);
        item.on('change', ({ key, previous, value }) => {
            property.instance.emit('change', {
                key: `${property.key}.${key}`,
                previous,
                value
            });
        });
        return item;
    }

    static normalize(field, next, previous) {
        if (!next) return undefined;
        if (typeof next === 'string') return next;
        const memory = field.value.memory;

        if (next.ƒ_uuid) {
            if (!memory.contains(next.uuid)) {
                memory.load(next);
            }
            return next.uuid;
        }

        const props = Object.assign({}, previous && memory.read(previous), next);
        const data = field.deserialize(props);
        return data.uuid;
    }

    static deserialize(field, value) {
        if (typeof value !== 'object') {
            throw new Error('Deserializer has not correct value to deserialize');
        }

        const keys = Object.keys(value);
        const fields = field.value.schema.values;
        for (let index = 0, length = fields.length; index < length; index++) {
            const field = fields[index];
            if (field.ƒ_regexp) {
                let props;
                for (let idx = 0, length = keys.length; index < length; index++) {
                    if (!field.is(keys[idx])) continue;
                    if (!props) props = {};
                    Object.assign(props, { [keys[index]]: field.normalize(value[keys[idx]]) });
                }
                if (!props) continue;
                Object.assign(value, { [field.key]: props });
            } else {
                if (!value.hasOwnProperty(field.key)) continue;
                Object.assign(value, {
                    [field.key]: field.normalize(value[field.key]),
                });
            }
        }

        if (!value.uuid) {
            value.uuid = uuid.v4();
            field.value.memory.create(value);
        } else {
            field.value.memory.load(value);
        }

        return value;
    }

    static serialize(field, value, options = {}) {
        if (!options.recorded) {
            options.recorded = new Map();
        }

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

        const props = field.value.memory.read(value);
        if (typeof options.populate === 'string') {
            options.recorded.set(value, props[options.populate]);
            return props[options.populate];
        }

        options.recorded.set(value, value);
        options = Object.assign({}, options, { depth: options.depth - 1 });
        if (typeof options.populate === 'function') {
            return options.populate(props, field.value, field.key);
        }
        if (options.populate === true) {
            const data = {};
            if (props.uuid) Object.assign(data, { uuid: props.uuid });
            const fields = field.value.schema.values;
            for (let index = 0, length = fields.length; index < length; index++) {
                Object.assign(data, {
                    [fields[index].key]: fields[index].serialize(props[fields[index].key], options),
                });
            }
            return data;
        }
        return value;
    }

    static validate(field, value) {
        if (value !== undefined && typeof value !== 'string' && typeof value !== 'object') {
            throw MixedType.createIncorrectTypeError(field,  `${field.value.name} || uuid || undefined`, value);
        }
        MixedType.validate(field, value);
    }
};
