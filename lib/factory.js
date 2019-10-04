const library = require('./library');

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
        if (!name) {
            throw new Error('You need to pass a name to your model.');
        }
        if (library.names.includes(name.toLowerCase())) {
            throw new Error(`Model with name "${name}" already exists.`);
        }
    }

    /**
     * Create a model class
     *
     * @param {String} name - Name of the model
     * @param {ModelClass} parent - Parent from which the schema is inherited
     * @param {Object} schema - Schema of the model
     * @param {Object} options
     * @returns {ModelClass}
     */
    create(name, parent, schema = {}, options = {}) {
        Factory.check(name);

        const { ModelClass } = require('./index');
        let model = ModelClass;
        if (parent instanceof Function && parent.prototype instanceof ModelClass) {
            model = parent;
        } else {
            options = schema;
            schema = parent;
        }

        const entity = createEntityClass(name, model, schema);
        const proxy = createProxyEntityClass(name, entity, schema);

        library.fill(name, schema, entity, proxy, !!options.virtual);
        return proxy;
    }
}

module.exports = new Factory();

const createEntityClass = (name, Model, schema) => {
    const Entity = class extends Model {
        constructor(props = {}, { from } = {}) {
            const params = Object.assign({},
                from instanceof Model ? from.serialize(false) : from,
                props instanceof Model ? props.serialize(false) : props
            );
            super(params);

            for (let key in schema) {
                if (schema.hasOwnProperty(key)) {
                    if (key === 'uuid') {
                        throw new Error('Field "uuid" is automatically set');
                    }

                    const definer = require('./property_definers').get(this, name, key, schema[key]);
                    definer.assign(this, key, schema[key]);
                    definer.define(this, key, schema[key]);
                    if (params[key] !== undefined && params[key] !== null) {
                        this.props[`_${key}`] = definer.normalize(definer.check(params[key]));
                    }
                }
            }

            const encyclopedia = library.get(this.constructor.name);
            encyclopedia.memory.load(this.serialize(false));
            if (!params.uuid) encyclopedia.memory.create(this.serialize(false));
            this.addEventListener('change', ({ value, previous }) => {
                if (value !== previous) encyclopedia.memory.update(this.serialize(false));
            });
        }

        /**
         * Serialize schema data
         *
         * @param populate
         * @param depth
         * @returns {{uuid: *}}
         */
        serialize(populate = true, depth = 512) {
            const single = (value) => {
                if (!value) return value;
                if (value instanceof Model) {
                    if (depth === 0) return value.uuid;
                    switch (typeof populate) {
                        case 'function': return populate(value);
                        case 'string': case 'boolean':
                        default:
                            return populate ? value.serialize(populate, --depth) : value.uuid;
                    }
                }
                return value;
            };

            let serialized = { uuid: this.uuid };
            for (let key in schema) {
                if (schema.hasOwnProperty(key)) {
                    serialized[key] = Array.isArray(schema[key])
                        ? this.props[key].map(value => single(value))
                        : single(this.props[key])
                    ;
                }
            }

            return serialized;
        }

        /**
         * Unserialize schema data
         *
         * @param props
         */
        unserialize(props) {
            if (props.uuid) this._uuid = props.uuid;
            for (let key in schema) {
                if (schema.hasOwnProperty(key) && props[key]) {
                    this.props[key] = props[key];
                }
            }
        }

        get props() {
            return this._props;
        }

        set props(props) {
            this.unserialize(props);
            return props;
        }

        get uuid() {
            return this._uuid;
        }
    };

    return Object.defineProperty(Entity, 'name', { value: name });
};

const createProxyEntityClass = (name, entity, schema) => {
    return new Proxy(entity, {
        construct(target, args) {
            return new Proxy(new target(...args), {
                get(target, property) {
                    if (typeof property === 'string' && Object.keys(schema).includes(property)) {
                        return target.props[property];
                    }
                    return target[property];
                },
                set(target, property, value) {
                    if (typeof property === 'string' && Object.keys(schema).includes(property)) {
                        target.props[property] = value;
                        return true;
                    }
                    target[property] = value;
                    return true;
                },
            });
        },
    });
};
