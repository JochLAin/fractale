
const uuid = require('uuid');
const library = require('./library');

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

        const ModelClass = require('./index').ModelClass;
        const Entity = class Model extends ModelClass {
            constructor(props = {}, parent) {
                props = Object.assign({},
                    parent instanceof Model ? parent.serialize() : parent,
                    props instanceof Model ? props.serialize() : props
                );

                super(props);
                this._uuid = props.uuid || uuid.v4();

                const encyclopedia = library.get(name);
                const schema = encyclopedia.schema;
                for (let key in schema) {
                    if (key === 'uuid') {
                        throw new Error('Field "uuid" is automatically set');
                    }
                    if (schema.hasOwnProperty(key)) {
                        const definer = require('./property_definers').get(this, key, schema[key]);
                        definer.assign(this, key, schema[key]);
                        definer.define(this, key, schema[key]);
                        if (props[key]) {
                            this[key] = props[key];
                        }
                    }
                }

                encyclopedia.set(this.serialize());
                this.addEventListener('change', ({ key, value }) => {
                    encyclopedia.dispatchEvent('update', { instance: this, key, value });
                    library.dispatchEvent('update', { name, instance: this, key, value });
                });
            }

            serialize(populate = true) {
                const schema = library.get(name).schema;
                let serialized = { uuid: this.uuid };
                for (let key in schema) {
                    if (schema.hasOwnProperty(key)) {
                        if (this[key] instanceof ModelClass) {
                            serialized[key] = (() => {
                                switch (typeof populate) {
                                    case 'function':
                                        return populate(this[key]);
                                    case 'string':
                                        return this[populate];
                                    case 'boolean':
                                    default:
                                        if (populate) {
                                            return this.serialize();
                                        } else {
                                            return this.uuid;
                                        }
                                }
                            })();
                        } else {
                            serialized[key] = this[key];
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
