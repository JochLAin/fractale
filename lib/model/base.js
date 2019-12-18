const uuid = require('uuid');
const EventListener = require('../utils/event_listener');
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

    set(name, value) {
        const type = this.constructor.schema.get(name);
        if (!type) return this;
        const property = this.ƒ_properties.get(type.key);
        property.set(value, name);
        return this;
    }

    get(name, raw = false) {
        const type = this.constructor.schema.get(name);
        if (!type) return;
        const property = this.ƒ_properties.get(type.key);
        return raw ? property.value : property.get(name);
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
        this.constructor.schema.validate(data);
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

    toJSON() {
        return this.serialize();
    }
};
