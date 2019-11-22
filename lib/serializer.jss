const moment = require('moment');
const uuid = require('uuid');
const { FIELD_KIND_ARRAY, FIELD_KIND_DATE, FIELD_KIND_MODEL } = require('./constants');

module.exports = class Serializer {
    static serialize(recorded = [], entity, props, populate = true, depth = 512) {
        if (!populate) return props;
        const fields = entity.schema.values;
        recorded.push(props.uuid);

        const closure = (field, value) => {
            if (!value) return;
            if (field.kind === FIELD_KIND_ARRAY) {
                const data = [];
                for (let index = 0, length = value.length; index < length; index++) {
                    data.push(closure(field.options.subfield, value[index]));
                }
                return data;
            }
            if (field.kind === FIELD_KIND_MODEL) {
                if (!depth) return value;
                if (recorded.includes(value)) return value;
                if (typeof populate === 'string' && !field.value.schema.keys.includes(populate)) {
                    return value;
                }

                const props = field.value.memory.read(value);
                if (populate === true) {
                    return Serializer.serialize(recorded, field.value, props, populate, depth - 1);
                }
                if (typeof populate === 'string') {
                    return props[populate];
                }
                if (typeof populate === 'function') {
                    return populate(props, field.value, field.key, field.index);
                }
            }
            return value;
        };

        const data = {};
        if (props.uuid) Object.assign(data, { uuid: props.uuid });
        for (let index = 0, length = fields.length; index < length; index++) {
            Object.assign(data, {
                [fields[index].key]: closure(
                    fields[index],
                    props[fields[index].key]
                )
            });
        }

        return data;
    };

    static deserialize(recorded = [], entity, props, data = {}) {
        const fields = entity.schema.values;
        if (props.uuid) {
            recorded.push(props.uuid);
        }

        const closure = (field, current, next) => {
            if (field.kind === FIELD_KIND_MODEL) {
                if (recorded.includes(current)) return current;
                const value = field.value.memory.read(current) || {};
                const { uuid } = Serializer.deserialize(recorded, field.value, value, next);
                return uuid;
            }
            if (field.kind === FIELD_KIND_ARRAY) {
                const data = [];
                for (let index = 0, length = next.length; index < length; index++) {
                    data.push(closure(field.options.subfield, undefined, next[index]));
                }
                return data;
            }
            if (field.kind === FIELD_KIND_DATE) {
                return moment(next).toISOString();
            }
            return next;
        };

        for (const index in fields) {
            if (!fields.hasOwnProperty(index)) continue;
            if (!data.hasOwnProperty(fields[index].key)) continue;
            Object.assign(props, {
                [fields[index].key]: closure(
                    fields[index],
                    props[fields[index].key],
                    data[fields[index].key]
                )
            });
        }

        if (!props.uuid) {
            props.uuid = uuid.v4();
            entity.memory.create(props);
            recorded.push(props.uuid);
        } else {
            entity.memory.load(props);
        }

        return props;
    };
};
