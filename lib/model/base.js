const uuid = require('uuid');
const EventListener = require('../utils/event_listener');
const OPT = require('../options');
const _ = require('../utils');

/**
 * Default base model class
 * @class Model
 * @extends EventListener
 * @param {Object} props - Properties pass to instance
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

    /**
     * Serialize entity into an object
     *
     * @param {Object} options
     * @param {Number} options.depth - Maximum depth to serialize
     * @param {Boolean|String|Function} options.populate - Specify if model child must be serialized or not
     * @return {Object}
     */
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

    /**
     * Deserialize object into an entity properties
     *
     * @param {Object} data
     * @return {Model}
     */
    deserialize(data) {
        if (!data) throw new Error('Deserializer has not correct data to deserialize');
        this.constructor.schema.validate(data);
        const props = _.flatten(this.constructor, data);
        for (let index = 0, keys = Object.keys(props), length = keys.length; index < length; index++) {
            this.set(keys[index], props[keys[index]]);
        }
        return this;
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

/**
 * @property {Boolean} ƒ_model
 * @memberOf Model
 * @static
 */

/**
 * @property {Model} entity
 * @memberOf Model
 * @static
 */

/**
 * @property {String} name
 * @memberOf Model
 * @static
 */

/**
 * @property {Model|undefined} parent
 * @memberOf Model
 * @static
 */

/**
 * @property {String} slug
 * @memberOf Model
 * @static
 */

/**
 * @property {Boolean} virtual
 * @memberOf Model
 * @static
 */

/**
 * @property {Schema} schema
 * @memberOf Model
 * @static
 */
