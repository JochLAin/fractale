const uuid = require('uuid');
const EventListener = require('../event_listener');
const { FIELD_KIND_ARRAY, FIELD_KIND_MIXED, FIELD_KIND_BOOLEAN, FIELD_KIND_NUMBER, FIELD_KIND_STRING, FIELD_KIND_DATE, FIELD_KIND_MODEL } = require('../constants');

/**
 * Default base model class
 * @class Model
 * @extends EventListener
 * @param {Object} props - Properties pass to instance
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class Model extends EventListener {
    constructor(props) {
        super();
        if (props.uuid) {
            this.ƒ_uuid = props.uuid;
            delete props.uuid;
        } else {
            this.ƒ_uuid = uuid.v4();
        }
        this.props = Object.freeze(props);
    }

    get(key, ...args) {
        return this.ƒ_properties.get(key).get(...args);
    }

    set(key, ...args) {
        return this.ƒ_properties.get(key).set(...args);
    }

    serialize(options = {}) {
        options = Object.assign({
            depth: options.depth || 512,
            populate: options.populate === undefined ? true : options.populate,
        });

        const data = {};
        if (this.uuid) Object.assign(data, { uuid: this.uuid });
        const keys = [...this.ƒ_properties.keys()];
        for (let index = 0, length = keys.length; index < length; index++) {
            Object.assign(data, {
                [keys[index]]: this.ƒ_properties.get(keys[index]).serialize(options)
            });
        }
        return data;
    }

    deserialize(data) {
        for (const key in data) {
            if (!data.hasOwnProperty(key)) continue;
            if (this.ƒ_properties.has(key)) {
                this.ƒ_properties.get(key).set(data[key]);
            } else {
                Object.assign(this.props, { [key]: data[key] });
            }
        }
    }

    get ƒ_entity() {
        return true;
    }

    get uuid() {
        return this.ƒ_uuid;
    }

    static getDependencies(model, dependencies = {}) {
        const closure = (accu, field) => {
            if (field.kind === FIELD_KIND_ARRAY) {
                return closure(accu, field.options.item);
            }
            if (field.kind !== FIELD_KIND_MODEL) return accu;
            if (field.value.name === field.schema.classname) return accu;
            if (field.value.virtual) return accu;
            if (accu[field.value.name]) return accu;
            Object.assign(accu, { [field.value.name]: field.value });
            Object.assign(accu, Model.getDependencies(field.value, accu));
            return accu;
        };
        return model.schema.fields.reduce(closure, dependencies);
    }

    static stringify(model, space) {
        const schema = JSON.stringify(model.schema, (k, v) => v || 'undefined', space).replace(/("([a-zA-Z0-9\-_.]+)":?)/g, (match, content, value) => {
            if (!content.match(/:$/)) return value;
            if (value.match(/^[a-zA-Z0-9]+$/)) return `${value}:`;
            return content;
        });
        return `const ${model.name} = Fractale.create("${model.name}", ${model.parent ? `${model.parent.name}, ` : ''}${schema});`;
    }

    toJSON() {
        return this.serialize();
    }
};
