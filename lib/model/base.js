'use strict';

const uuid = require('uuid');
const EventListener = require('../event_listener');
const _ = require('../utils');

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
        this.ƒ_properties = new Map();
        this.props = Object.freeze(props);
    }

    get(name) {
        const field = this.constructor.schema.get(name);
        if (!field) return;
        const property = this.ƒ_properties.get(field.key);
        if (field.ƒ_regexp && name !== field.key.toString()) {
            return property.fork(name).get();
        }
        return property.get();
    }

    set(name, value) {
        const field = this.constructor.schema.get(name);
        if (!field) return this;
        const property = this.ƒ_properties.get(field.key);
        if (field.ƒ_regexp && name !== field.key.toString()) {
            const subproperty = property.fork(name).set(value);
            value = Object.assign(property.get(), { [name]: subproperty.get() });
        }
        property.set(value);
        return this;
    }

    serialize(options = {}) {
        Object.assign(options,{
            depth: options.depth || 512,
            populate: options.populate === undefined ? true : options.populate,
            recorded: options.recorded || new Map(),
        });

        const data = {};
        if (this.uuid) Object.assign(data, { uuid: this.uuid });
        const keys = Array.from(this.ƒ_properties.keys());
        for (let index = 0, length = keys.length; index < length; index++) {
            Object.assign(data, {
                [keys[index]]: this.ƒ_properties.get(keys[index]).serialize(options)
            });
        }
        return data;
    }

    deserialize(data) {
        if (!data) throw new Error('Deserializer has not correct data to deserialize');
        const props = _.deserialize(this.constructor, data);
        for (let index = 0, keys = Object.keys(props), length = keys.length; index < length; index++) {
            const field = this.constructor.schema.get(keys[index]);
            if (!field) continue;
            this.ƒ_properties.get(field.key).set(props[keys[index]]);
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
            if (field.compound) return closure(accu, field.fork(0));
            if (!field.is('ƒ_model')) return accu;
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
            if (!/:$/.test(content)) return value;
            if (/^[a-zA-Z0-9]+$/.test(value)) return `${value}:`;
            return content;
        });
        return `const ${model.name} = Fractale.create("${model.name}", ${model.parent ? `${model.parent.name}, ` : ''}${schema});`;
    }

    toJSON() {
        return this.serialize();
    }
};
