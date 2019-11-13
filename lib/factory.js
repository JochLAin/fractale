const library = require('./library');
const PropertyDefiner = require('./property_definers');
const Fractale = require('./index');
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
    static check(name) {
        return !library.names.includes(name.toLowerCase());
    }

    createSchema(props, parent) {
        if (props instanceof Schema) {
            if (props.parent === parent) {
                return props;
            }
        }
        return new Schema(props, parent);
    }

    /**
     * Create a model class
     *
     * @param {String} name - Name of the model
     * @param {Model} parent - Parent from which the schema is inherited
     * @param {Object} schema - Schema of the model
     * @param {Object} options
     * @returns {Model}
     */
    createModel(name, parent, schema = {}, options = {}) {
        if (!name) {
            throw new Error('You need to pass a name to your model.');
        }
        if (!Factory.check(name)) {
            throw new Error(`Model with name "${name}" already exists.`);
        }

        let model = Fractale.Model;
        if (parent instanceof Function && parent.prototype instanceof Fractale.Model) {
            model = library.get(parent.name);
            schema = this.createSchema(schema, parent);
        } else {
            options = schema;
            schema = this.createSchema(parent);
            parent = undefined;
        }

        const entity = createEntityClass(name, model, schema);
        Object.defineProperty(entity, 'name', { value: name });
        Object.defineProperty(entity, 'slug', { value: name.toLowerCase() });
        Object.defineProperty(entity, 'schema', { value: Object.assign({}, parent && parent.schema, schema) });
        Object.defineProperty(entity, 'parent', { value: parent });
        Object.defineProperty(entity, 'virtual', { value: !!options.virtual });

        const proxy = createProxyEntityClass(name, entity);
        Object.defineProperty(entity, 'proxy', { value: proxy });

        library.add(entity);
        return proxy;
    }
}

const createEntityClass = (name, Parent, schema) => {
    return class Entity extends Parent {
        constructor(props = {}, { from } = {}) {
            const params = Object.assign({},
                from instanceof Entity ? from.serialize(false) : from,
                props instanceof Entity ? props.serialize(false) : props
            );

            super(params);

            const encyclopedia = library.get(name);
            this.serialize = PropertyDefiner.serialize.bind(null, this, encyclopedia.schema);
            this.deserialize = PropertyDefiner.deserialize.bind(null, this, encyclopedia.schema);

            PropertyDefiner.define(this, schema, params);
            library.register(this, params);
        }
    };
};

const createProxyEntityClass = (name, entity, schema) => {
    return new Proxy(entity, {
        construct(target, args) {
            return new Proxy(new target(...args), {
                has(target, property) {
                    return Object.keys(schema).includes(property);
                },
                get(target, property) {
                    if (typeof property === 'string' && Object.keys(entity.schema).includes(property)) {
                        return target.props[property];
                    }
                    return target[property];
                },
                set(target, property, value) {
                    if (typeof property === 'string' && Object.keys(entity.schema).includes(property)) {
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
