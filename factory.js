

const uuid = require('uuid');
const PropertyDefiner = require('./property_definers');
const BasicModel = require('./index');
const library = require('./library');

class ModelFactory {
    check(name) {
        if (!name) {
            throw new Error('You need to pass a name to your model.');
        }
        if (library.names.includes(name.toLowerCase())) {
            throw new Error(`Model with name "${name}" already exists.`);
        }
    }

    create(name, parent, schema) {
        this.check(name);
        library.fill(name, schema);

        if (typeof parent == 'function') {
            schema = Object.assign({}, library.get(parent.constructor.name).schema, schema);
        } else {
            schema = parent;
            parent = undefined;            
        }

        const entity = class Model extends BasicModel {
            constructor(props = {}) {
                super(props);
                this._uuid = props.uuid || uuid.v4();

                for (let key in schema) {
                    if (key == 'uuid') {
                        throw new Error('Field "uuid" is automatically set');
                    }
                    const definer = PropertyDefiner.get(this, key, schema[key]);
                    definer.assign(this, key, schema[key]);
                    definer.define(this, key, schema[key]);
                    if (props[key]) {
                        this[key] = props[key];
                    }
                }

                library.get(name).set(this.serialize());
            }

            serialize() {
                let serialized = { uuid: this.uuid };
                for (let key in schema) {
                    serialized[key] = this[key];
                }
                return serialized;
            }

            get uuid() {
                return this._uuid;
            }
        }

        return Object.defineProperty(entity, 'name', { value: name });
    }

    with(type, options) {
        return {
            __type: type,
            __options: options
        };
    }
}

module.exports = new ModelFactory();
