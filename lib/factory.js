const uuid = require('uuid');
const CONSTANTS = require('./constants');
const library = require('./library');
const memory = require('./memory');
const models = require('./model');
const PropertyDefiner = require('./property_definers');
const Schema = require('./schema');

/**
 * Create model class
 *
 * @class Factory
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
class Factory {
    /**
     * Check if model name is already used
     * @param {String} name - Name of the model
     */
    static validate(name) {
        return !library.names.includes(name.toLowerCase());
    }

    createSchema(name, props, parent) {
        if (props instanceof Schema) {
            if (props.parent === parent) {
                return props;
            }
        }
        return new Schema(name, props, parent);
    }

    /**
     * Create a model class
     *
     * @param {String} name - Name of the model
     * @param {String|Model} parent - Parent from which the schema is inherited
     * @param {Object} schema - Schema of the model
     * @param {Object} options
     * @returns {Model}
     */
    createModel(name, parent, schema = {}, options = {}) {
        if (!name) {
            throw new Error('You need to pass a name to your model.');
        }
        if (!Factory.validate(name)) {
            throw new Error(`Model with name "${name}" already exists.`);
        }

        const Model = models.get();
        let model = Model;
        if (typeof parent === 'string') {
            model = library.get(parent);
            schema = this.createSchema(name, schema, model.schema);
        } else if (parent instanceof Function) {
            if (parent.prototype instanceof Model) {
                model = library.get(parent.name);
                schema = this.createSchema(name, schema, parent.schema);
            }
        } else {
            options = schema;
            schema = this.createSchema(name, parent);
        }

        const entity = createEntityClass.call(this, name, model, schema);
        Object.defineProperty(entity, 'entity', { value: entity });
        Object.defineProperty(entity, 'name', { value: name });
        Object.defineProperty(entity, 'slug', { value: name.toLowerCase() });
        Object.defineProperty(entity, 'schema', { value: schema });
        Object.defineProperty(entity, 'virtual', { value: !!options.virtual });

        const proxy = createProxyEntityClass.call(this, entity);
        Object.defineProperty(proxy, 'entity', { value: entity });
        Object.defineProperty(entity, 'proxy', { value: proxy });

        const table = memory.createTable(entity);
        Object.defineProperty(entity, 'memory', { value: table });

        library.add(entity);
        return proxy;
    }
}

const createEntityClass = (name, Parent, schema) => {
    const Model = models.get();
    return class Entity extends Parent {
        constructor(props = {}) {
            const params = props instanceof Model ? props.serialize(false) : Object(props);
            super(params);

            this.serialize = PropertyDefiner.serialize.bind(null, this);
            this.deserialize = PropertyDefiner.deserialize.bind(null, this.constructor.schema, this.props);

            PropertyDefiner.define(this, schema, params);
        }

        static create(props) {
            if (props instanceof Model) {
                props = props.serialize();
            }
            const Proxy = Entity.proxy;
            return new Proxy(props);
        }

        static from(props) {
            if (props instanceof Model) {
                props = props.serialize();
            }
            props = Object(props);
            delete props.uuid;
            const Proxy = Entity.proxy;
            return new Proxy(props);
        }

        static save(data = {}, previous = {}) {
            if (typeof previous === 'string') {
                previous = Entity.memory.read(previous);
            }
            const props = {};
            const schema = Entity.schema.values;
            for (const index in schema) {
                if (!schema.hasOwnProperty(index)) continue;
                const field = schema[index];
                if (!data.hasOwnProperty(field.key)) {
                    Object.assign(props, { [field.key]: previous[field.key] });
                } else if (field.type === CONSTANTS.FIELD_TYPE_ARRAY) {
                    Object.assign(props, {
                        [field.key]: data[field.key].map((value) => {
                            if (field.options.subfield.type === CONSTANTS.FIELD_TYPE_MODEL) {
                                return field.options.subfield.value.save(value);
                            }
                            return value;
                        })
                    });
                } else if (field.type === CONSTANTS.FIELD_TYPE_MODEL) {
                    Object.assign(props, {
                        [field.key]: field.value.save(data[field.key], previous[field.key])
                    });
                } else {
                    Object.assign(props, { [field.key]: data[field.key] || previous[field.key] });
                }
            }

            if (!props.uuid) {
                props.uuid = uuid.v4();
                Entity.memory.create(props);
            } else {
                Entity.memory.update(props);
            }
            return props.uuid;
        }
    };
};

const createProxyEntityClass = (model) => {
    return new Proxy(model, {
        construct(target, args) {
            const props = args.shift() || {};
            const entity = new target(props, ...args);

            const memory = entity.constructor.memory;
            if (props.uuid) memory.update(entity.serialize(false));
            else memory.create(entity.serialize(false));
            entity.on('change', ({ value, previous }) => {
                if (value !== previous) {
                    memory.update(entity.serialize(false));
                }
            });

            return new Proxy(entity, {
                has(target, property) {
                    return model.schema.keys.includes(property);
                },
                get(target, property) {
                    if (typeof property === 'string' && model.schema.keys.includes(property) && !target[property]) {
                        return target.props[property];
                    }
                    return target[property];
                },
                set(target, property, value) {
                    if (typeof property === 'string' && model.schema.keys.includes(property) && !target[property]) {
                        target.props[property] = value;
                        return true;
                    }
                    target[property] = value;
                    return true;
                },
            });
        }
    });
};

module.exports = new Factory();
