
const uuid = require('uuid');
const library = require('./library');
const KEYWORDS = ['props', 'serialize', 'unserialize', 'save', 'update'];

/**
 * Create model class
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

        const Entity = class Model extends require('./index').ModelClass {
            constructor(props = {}, overrider) {
                super(Object.assign({},
                    overrider instanceof Model ? overrider.serialize(false) : overrider,
                    props instanceof Model ? props.serialize(false) : props
                ));
                this._uuid = this.props.uuid || uuid.v4();

                const encyclopedia = library.get(name);
                const schema = encyclopedia.schema;
                for (let key in schema) {
                    if (schema.hasOwnProperty(key)) {
                        if (KEYWORDS.includes(key)) {
                            throw new Error(`The "${key}" key is a protected keyword`);
                        }
                        if (key === 'uuid') {
                            throw new Error('Field "uuid" is automatically set');
                        }

                        const definer = require('./property_definers').get(this, key, schema[key]);
                        definer.assign(this, key, schema[key]);
                        definer.define(this, key, schema[key]);
                        if (this.props[key]) {
                            this[key] = this.props[key];
                        }
                    }
                }

                encyclopedia.set(this.serialize(false));
                this.addEventListener('change', ({ key, value }) => {
                    encyclopedia.dispatchEvent('update', { instance: this, key, value });
                    library.dispatchEvent('update', { name, instance: this, key, value });
                });
            }

            serialize(populate = true, depth = -1) {
                const callback = (instance, schema, key, value) => {
                    if (!value) return value;
                    if (value instanceof require('./index').ModelClass) {
                        if (depth === 0) return value.uuid;
                        switch (typeof populate) {
                            case 'function':
                                return populate(value);
                            case 'string':
                                return instance[populate];
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
                            serialized[key] = this[key].map(value => callback(this, schema, key, value));
                        } else {
                            serialized[key] = callback(this, schema, key, this[key]);
                        }
                    }
                }

                return serialized;
            }

            unserialize(props) {
                const schema = library.get(name).schema;
                for (let key in schema) {
                    if (schema.hasOwnProperty(key) && props[key]) {
                        this[key] = props[key];
                    }
                }
            }

            get uuid() {
                return this._uuid;
            }
        };

        const model = Object.defineProperty(Entity, 'name', {value: name});
        library.fill(name, schema, model, !!virtual);
        return model;
    }
}

module.exports = new Factory();
