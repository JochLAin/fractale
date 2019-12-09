'use strict';

const uuid = require('uuid');
const EventListener = require('../event_listener');
const OPT = require('../options');
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
        return property.get(name);
    }

    set(name, value) {
        const type = this.constructor.schema.get(name);
        if (!type) return this;
        const property = this.ƒ_properties.get(type.key);
        property.set(value, name);
        return this;
    }

    serialize(options = { depth: 512, populate: true, recorded: new Map() }) {
        const data = {};
        if (this.uuid) Object.assign(data, { uuid: this.uuid });
        const keys = Array.from(this.ƒ_properties.keys());
        for (let index = 0, length = keys.length; index < length; index++) {
            const property = this.ƒ_properties.get(keys[index]);
            const serialized = property.serialize(options);
            if (property.type.ℹ_regexp && OPT.get('flat_regexp')) {
                Object.assign(data, serialized);
            } else {
                Object.assign(data, { [keys[index]]: serialized });
            }
        }
        return data;
    }

    deserialize(data) {
        if (!data) throw new Error('Deserializer has not correct data to deserialize');
        const props = _.flatten(this.constructor, data);
        for (let index = 0, keys = Object.keys(props), length = keys.length; index < length; index++) {
            this.set(keys[index], props[keys[index]]);
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
