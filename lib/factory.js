const logger = require('crieur');
const library = require('./library');
const PropertyDefiner = require('./property_definers');
const Schema = require('./schema');
const memory = require('./memory');
let Model = require('./model');

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

        let model = this.Model;
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

        const entity = createEntityClass(name, model, schema);
        Object.defineProperty(entity, 'entity', { value: entity });
        Object.defineProperty(entity, 'name', { value: name });
        Object.defineProperty(entity, 'slug', { value: name.toLowerCase() });
        Object.defineProperty(entity, 'schema', { value: schema });
        Object.defineProperty(entity, 'virtual', { value: !!options.virtual });

        const proxy = createProxyEntityClass(entity);
        Object.defineProperty(entity, 'proxy', { value: proxy });

        const table = memory.createTable(entity);
        Object.defineProperty(entity, 'memory', { value: table });

        library.add(entity);
        return proxy;
    }

    get Model() {
        return Model;
    }

    set Model(_Model) {
        if (!(_Model === Model || _Model.prototype instanceof require('./model'))) {
            throw new Error('Your model class must inherit "Fractale.Model" class');
        }
        Model = _Model;
    }
}

const createEntityClass = (name, Parent, schema) => {
    return class Entity extends Parent {
        constructor(props = {}) {
            const params = props instanceof Model ? props.serialize(false) : props;
            super(params);

            this.serialize = PropertyDefiner.serialize.bind(null, this);
            this.deserialize = PropertyDefiner.deserialize.bind(null, this);

            PropertyDefiner.define(this, schema, params);
        }
    };
};

const createProxyEntityClass = (model) => {
    return new Proxy(model, {
        construct(target, args) {
            const entity = new target(...args);

            const memory = entity.constructor.memory;
            memory.load(entity.serialize(false));
            entity.addEventListener('change', ({ value, previous }) => {
                if (value !== previous) {
                    memory.update(entity.serialize(false));
                }
            });

            return new Proxy(entity, {
                has(target, property) {
                    return model.schema.keys.includes(property);
                },
                get(target, property) {
                    if (typeof property === 'string' && model.schema.keys.includes(property)) {
                        return target.props[property];
                    }
                    return target[property];
                },
                set(target, property, value) {
                    if (typeof property === 'string' && model.schema.keys.includes(property)) {
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
