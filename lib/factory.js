/**
 * @class Factory
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
const Factory = module.exports;

const library = require('./library');
const memory = require('./memory');
const models = require('./model');
const Property = require('./property');
const Schema = require('./property/schema');
const Bridge = require('./bridges');

/**
 * Check if model name is already used
 * @method validate
 * @param {String} name - Name of the model
 */
Factory.validate = (name) => {
    if (!name) {
        throw new Error('You need to pass a name to your model.');
    }
    const regexp = /^((?:[a-zA-Z0-9ƒ_\-.]|\[\])+)$/g;
    if (!regexp.test(name)) {
        throw new Error(`Invalid model name ${name}, it must match ${regexp.toString()}`);
    }
    if (library.names.includes(name.toLowerCase())) {
        throw new Error(`Model with name "${name}" already exists.`);
    }
};

/**
 * Create a model class
 *
 * @method createModel
 * @param {String} name - Name of the model
 * @param {String|Model} parent - Parent from which the schema is inherited
 * @param {Object} schema - Schema of the model
 * @param {Object} options
 * @returns {Model}
 */
Factory.createModel = (name, parent, schema = {}, options = {}) => {
    Factory.validate(name);

    let model;
    if (typeof parent === 'string') {
        parent = model = library.get(parent);
    } else if (parent instanceof Function && Object.prototype.hasOwnProperty.call(parent, 'ƒ_model')) {
        parent = model = library.get(parent.name);
    } else {
        model = models.get();
        options = schema;
        schema = parent;
        parent = undefined;
    }

    const entity = createEntityClass.call(null, name, model);
    /** @property {Boolean} ƒ_model @memberof Model @static */
    Object.defineProperty(entity, 'ƒ_model', { value: true });
    /** @property {Model} entity @memberof Model @static */
    Object.defineProperty(entity, 'entity', { value: entity });
    /** @property {String} name @memberof Model @static */
    Object.defineProperty(entity, 'name', { value: name });
    /** @property {Model|undefined} parent @memberof Model @static */
    Object.defineProperty(entity, 'parent', { value: parent });
    /** @property {String} slug @memberof Model @static */
    Object.defineProperty(entity, 'slug', { value: name.toLowerCase() });
    /** @property {Boolean} virtual @memberof Model @static */
    Object.defineProperty(entity, 'virtual', { value: !!options.virtual });

    /** @property {Proxy} proxy @memberof Model @static */
    const proxy = createProxyEntityClass.call(null, entity);
    Object.defineProperty(entity, 'proxy', { value: proxy });
    library.add(proxy);

    schema = new Schema(entity, schema);
    /** @property {Schema} schema @memberof Model @static */
    Object.defineProperty(entity, 'schema', { value: schema });

    const table = memory.createTable(entity);
    Object.defineProperty(entity, 'memory', { value: table });

    return proxy;
};

const createEntityClass = (name, Parent) => {
    return class Entity extends Parent {
        constructor(params = {}) {
            if (params.ƒ_entity) params = params.serialize({ populate: false });
            // Clone object to not delete entry on reference
            params = Object.assign({}, Entity.schema.default, params);

            // Marshal props for schema and others
            const props = {};
            for (let index = 0, keys = Object.keys(params), length = keys.length; index < length; index++) {
                if (Entity.schema.get(keys[index], false)) continue;
                props[keys[index]] = params[keys[index]];
                delete params[keys[index]];
            }
            super(props);

            // Assign value to props of schema
            for (let index = 0, types = Entity.schema.types, length = types.length; index < length; index++) {
                this.ƒ_properties.set(
                    types[index].key,
                    new Property(this, types[index])
                );
            }
            this.deserialize(params);
        }

        static create(props = {}) {
            if (props.ƒ_entity) {
                props = props.serialize();
            }
            const Proxy = Entity.proxy;
            return new Proxy(props);
        }

        static from(props = {}) {
            if (props.ƒ_entity) {
                props = props.serialize();
            }
            props = Object(props);
            delete props.uuid;
            const Proxy = Entity.proxy;
            return new Proxy(props);
        }

        static stringify(space) {
            const schema = JSON.stringify(Entity.schema, (k, v) => v || 'undefined', space).replace(/("([a-zA-Z0-9\-_.()']+)":?)/g, (match, content, value) => {
                if (!/:$/.test(content)) return value;
                if (/^[a-zA-Z0-9]+$/.test(value)) return `${value}:`;
                return content;
            });
            return `const ${Entity.name} = Fractale.create("${Entity.name}", ${Entity.parent ? `${Entity.parent.name}, ` : ''}${schema});`;
        }

        static getDependencies(dependencies = {}) {
            const closure = (accu, type) => {
                if (type.is('ƒ_array')) return closure(accu, type.subtype);
                if (!type.is('ƒ_model')) return accu;
                if (type.input.name === type.schema.classname) return accu;
                if (type.input.virtual) return accu;
                if (accu[type.input.name]) return accu;
                Object.assign(accu, { [type.input.name]: type.input });
                Object.assign(accu, type.input.getDependencies(accu));
                return accu;
            };
            return Entity.schema.types.reduce(closure, dependencies);
        }
    };
};

const createProxyEntityClass = (model) => {
    return new Proxy(model, {
        construct(target, args, newt) {
            const props = args[0] || {};
            const entity = Reflect.construct(target, args, newt);

            const memory = entity.constructor.memory;
            if (props.uuid) memory.ƒ_update(entity.serialize({ populate: false }));
            else memory.ƒ_create(entity.serialize({ populate: false }));
            entity.on('change', ({ key, value, previous }) => {
                if (!model.schema.get(key)) return;
                if (value === previous) return;
                memory.ƒ_update(entity.serialize({ populate: false }));
            });

            return new Proxy(entity, {
                get(target, property) {
                    if (!model.schema.get(property)) {
                        return target[property];
                    }
                    if (typeof property === 'string') {
                        if (!(target instanceof model) && target[property]) {
                            throw new Error(`Property ${property} is defined in schema and class ${model.name}`);
                        }
                        return target.get(property);
                    } if (property instanceof RegExp) {
                        return target.get(property);
                    }
                },
                set(target, property, value) {
                    const type = model.schema.get(property);
                    if (!type) {
                        target[property] = value;
                        return true;
                    }
                    if (typeof property === 'string') {
                        if (!(target instanceof model) && target[property]) {
                            throw new Error(`Property ${property} is defined in schema and class ${model.name}`);
                        }
                        target.set(property, value);
                        return true;
                    }
                },
                deleteProperty(target, property) {
                    target[property] = undefined;
                    return true;
                },
                enumerate() {
                    return model.schema.values;
                },
                ownKeys() {
                    return model.schema.values;
                },
                has(target, property) {
                    return model.schema.has(property);
                },
                defineProperty(target, key, desc) {
                    if (key in model.schema.values) {
                        if (desc && 'value' in desc) target[key] = desc.value;
                        return target;
                    }
                    return Object.defineProperty(target, key, desc);
                },
            });
        },
        get(target, property) {
            if (typeof property !== 'string') return target[property];
            if (property.slice(0, 2) !== 'to' && property.slice(0, 4) !== 'from') return target[property];
            const direction = property.slice(0, 2) === 'to';
            const name = direction ? property.slice(2) : property.slice(4);
            const bridge = Bridge.get().find(bridge => bridge.name.toLowerCase() === name.toLowerCase());
            if (!bridge) return target[property];
            return (options) => {
                if (direction) {
                    return bridge.export(target, options);
                }
                return bridge.import(target, options);
            }
        }
    });
};
