const uuid = require('uuid');
const MixedSerializer = require('./mixed');

module.exports = class ModelSerializer extends MixedSerializer {
    static deserialize(field, value) {
        if (!value) {
            throw new Error('Deserializer has no value to deserialize');
        }

        const fields = field.value.schema.values;
        for (let index = 0, length = fields.length; index < length; index++) {
            if (!value.hasOwnProperty(fields[index].key)) continue;

            Object.assign(value, {
                [fields[index].key]: fields[index].normalize(value[fields[index].key]),
            });
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
};
