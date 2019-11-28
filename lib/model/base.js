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
        const type = this.constructor.schema.get(name);
        if (!type) return;
        const property = this.ƒ_properties.get(type.key);
        // if (type.ƒ_regexp && name !== type.key.toString()) {
        //     return property.split(name).expose();
        // }
        return property.get();
    }

    set(name, value) {
        const type = this.constructor.schema.get(name);
        if (!type) return this;
        const property = this.ƒ_properties.get(type.key);
        // if (type.ƒ_regexp && name !== type.key.toString()) {
        //     const subproperty = property.split(name).set(value);
        //     value = Object.assign(property.get(), { [name]: subproperty.get() });
        // }
        property.set(value);
        return this;
    }

    serialize(options = {}) {
        Object.assign(options,{
            depth: options.hasOwnProperty('depth') ? options.depth : 512,
            populate: options.hasOwnProperty('populate') ? options.populate : true,
            recorded: options.hasOwnProperty('recorded') ? options.recorded : new Map(),
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
        const props = _.flatten(this.constructor, data);
        for (let index = 0, keys = Object.keys(props), length = keys.length; index < length; index++) {
            const type = this.constructor.schema.get(keys[index]);
            if (!type) continue;
            this.ƒ_properties.get(type.key).set(props[keys[index]]);
        }
    }

    get ƒ_entity() {
        return true;
    }

    get uuid() {
        return this.ƒ_uuid;
    }

    static getDependencies(model, dependencies = {}) {
        const closure = (accu, type) => {
            if (type.is('ƒ_array')) return closure(accu, type.subtype);
            if (!type.is('ƒ_model')) return accu;
            if (type.input.name === type.schema.classname) return accu;
            if (type.input.virtual) return accu;
            if (accu[type.input.name]) return accu;
            Object.assign(accu, { [type.input.name]: type.input });
            Object.assign(accu, Model.getDependencies(type.input, accu));
            return accu;
        };
        return model.schema.types.reduce(closure, dependencies);
    }

    static stringify(model, space) {
        const schema = JSON.stringify(model.schema, (k, v) => v || 'undefined', space).replace(/("([a-zA-Z0-9\-_\.\(\)']+)":?)/g, (match, content, value) => {
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
