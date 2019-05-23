
const uuid = require('uuid');
const PropertyDefiner = require('./property_definers');
const BasicModel = require('./index');
const library = require('./library');
const { SELF } = require('./constants');

class ModelFactory {
    static check(name) {
        if (!name) {
            throw new Error('You need to pass a name to your model.');
        }
        if (library.names.includes(name.toLowerCase())) {
            throw new Error(`Model with name "${name}" already exists.`);
        }
    }

    create(name, parent, schema) {
        ModelFactory.check(name);

        if (typeof parent == 'function') {
            schema = Object.assign({}, library.get(parent.constructor.name).schema, schema);
        } else {
            schema = parent;
        }
        library.fill(name, schema);

        const entity = class Model extends this.modelClass {
            constructor(props = {}) {
                super(props);
                this._uuid = props.uuid || uuid.v4();

                for (let key in schema) {
                    if (key === 'uuid') {
                        throw new Error('Field "uuid" is automatically set');
                    }
                    if (schema.hasOwnProperty(key)) {
                        const definer = PropertyDefiner.get(this, key, schema[key]);
                        definer.assign(this, key, schema[key]);
                        definer.define(this, key, schema[key]);
                        if (props[key]) {
                            this[key] = props[key];
                        }
                    }
                }

                library.get(name).set(this.serialize());
                library.dispatchEvent('initialize', { name, instance: this });
                // if (library.socket) {
                //     this.addEventListener('change', () => {
                //         this.socket.emit(`change`, Object.assign({_name: name}, this.serialize()));
                //         this.socket.on(`refresh`, (props) => {
                //             if (props._name === name && props.uuid === this.uuid) {
                //                 this.unserialize(props);
                //             }
                //         });
                //         this.socket.emit(`change_${name.toLowerCase()}`, this.serialize());
                //         this.socket.on(`refresh_${name.toLowerCase()}`, (props) => {
                //             if (props.uuid === this.uuid) {
                //                 this.unserialize(props);
                //             }
                //         });
                //     });
                // }
            }

            serialize() {
                let serialized = {uuid: this.uuid};
                for (let key in schema) {
                    if (schema.hasOwnProperty(key)) {
                        serialized[key] = this[key];
                    }
                }
                return serialized;
            }

            unserialize(props) {
                for (let key in schema) {
                    if (schema.hasOwnProperty(key) && props[key]) {
                        this[key] = props[key];
                    }
                }
            }

            get uuid() {
                return this._uuid;
            }
        }

        return Object.defineProperty(entity, 'name', {value: name});
    }

    with(type, options) {
        return {
            __type: type,
            __options: options
        };
    }

    set modelClass(modelClass) {
        if (modelClass instanceof BasicModel) {
            this._modelClass = modelClass;
        }
    }

    get modelClass() {
        if (!this._modelClass) {
            this._modelClass = BasicModel;
        }
        return this._modelClass;
    }
}

module.exports = new ModelFactory();

module.exports.BasicModel = BasicModel;
module.exports.SELF = SELF;
