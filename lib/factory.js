
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

    static override(props, overrider) {
        return
    }

    /**
     * Create a model class
     *
     * @param {String} name - Name of the model
     * @param {ModelClass} parent - Parent from which the schema is inherited
     * @param {Object} schema - Schema of the model
     * @param {Boolean} virtual
     * @returns {ModelClass}
     */
    create(name, parent, schema, virtual = false) {
        Factory.check(name);

        if (typeof parent == 'function') {
            schema = Object.assign({}, library.get(parent.constructor.name).schema, schema);
        } else {
            schema = parent;
        }

        const Model = require('./index').ModelClass;
        const Entity = class extends Model {
            constructor(props = {}, overrider) {
                const params = Object.assign({},
                    overrider instanceof Model ? overrider.serialize(false) : overrider,
                    props instanceof Model ? props.serialize(false) : props
                );
                super(params);

                const encyclopedia = library.get(name);
                const schema = encyclopedia.schema;
                for (let key in schema) {
                    if (schema.hasOwnProperty(key)) {
                        if (key === 'uuid') {
                            throw new Error('Field "uuid" is automatically set');
                        }

                        const definer = require('./property_definers').get(this, key, schema[key]);
                        definer.assign(this, key, schema[key]);
                        definer.define(this, key, schema[key]);
                        if (params[key] !== undefined && params[key] !== null) {
                            this.props[`_${key}`] = definer.normalize(definer.check(params[key]));
                        }
                    }
                }

                encyclopedia.memory.load(this.serialize(false));
                if (!params.uuid) encyclopedia.memory.create(this.serialize(false));
                this.addEventListener('change', ({ key, value, previous }) => {
                    if (value !== previous) encyclopedia.memory.update(this.serialize(false));
                    if (process.env.LOG_LEVEL === 'debug') {
                        if (Array.isArray(previous) || Array.isArray(value)) {
                            // console.log(`[${this.constructor.name}] ${key} change`);
                        } else {
                            if (previous instanceof Model) previous = previous.uuid;
                            if (value instanceof Model) value = value.uuid;
                            // console.log(`[${this.constructor.name}] ${key} change: ${JSON.stringify(previous)} => ${JSON.stringify(value)}`);
                        }
                    }
                });

                return new Proxy(this, {
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
                    }
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
                const single = (instance, schema, key, value) => {
                    if (!value) return value;
                    if (value instanceof require('./index').ModelClass) {
                        if (depth === 0) return value.uuid;
                        switch (typeof populate) {
                            case 'function':
                                return populate(value);
                            case 'string':
                            case 'boolean':
                            default:
                                return populate ? value.serialize(populate, --depth) : value.uuid;
                        }
                    }
                    return value;
                };

                const schema = library.get(name).schema;
                let serialized = { uuid: this.uuid };
                for (let key in schema) {
                    if (schema.hasOwnProperty(key)) {
                        if (Array.isArray(schema[key])) {
                            serialized[key] = this.props[key].map(value => {
                                return single(this, schema, key, value)
                            });
                        } else {
                            serialized[key] = single(this, schema, key, this.props[key]);
                        }
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
                const schema = library.get(name).schema;
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

        const entity = Object.defineProperty(Entity, 'name', { value: name });
        library.fill(name, schema, entity, !!virtual);
        return entity;
    }
}

module.exports = new Factory();
