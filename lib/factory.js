'use strict';

/**
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */

const library = require('./library');
const memory = require('./memory');
const models = require('./model');
const Property = require('./property');
const Schema = require('./property/schema');

/**
 * Check if model name is already used
 * @param {String} name - Name of the model
 */
module.exports.validate = (name) => {
    if (!name) {
        throw new Error('You need to pass a name to your model.');
    }
    if (!name.match(/^[a-zA-Z0-9\-_\.]+$/g)) {
        throw new Error(`Invalid model name ${name}, it must match /^[a-zA-Z0-9\\-_\\.]+$/g`);
    }
    if (library.names.includes(name.toLowerCase())) {
        throw new Error(`Model with name "${name}" already exists.`);
    }
};

/**
 * Create a model class
 *
 * @param {String} name - Name of the model
 * @param {String|Model} parent - Parent from which the schema is inherited
 * @param {Object} schema - Schema of the model
 * @param {Object} options
 * @returns {Model}
 */
module.exports.createModel = (name, parent, schema = {}, options = {}) => {
    module.exports.validate(name);

    let model;
    if (typeof parent === 'string') {
        parent = model = library.get(parent);
    } else if (parent instanceof Function && parent.hasOwnProperty('ƒ_model')) {
        parent = model = library.get(parent.name);
    } else {
        model = models.get();
        options = schema;
        schema = parent;
        parent = undefined;
    }

    const entity = createEntityClass.call(null, name, model);
    Object.defineProperty(entity, 'ƒ_model', { value: true });
    Object.defineProperty(entity, 'entity', { value: entity });
    Object.defineProperty(entity, 'name', { value: name });
    Object.defineProperty(entity, 'parent', { value: parent });
    Object.defineProperty(entity, 'slug', { value: name.toLowerCase() });
    Object.defineProperty(entity, 'virtual', { value: !!options.virtual });

    schema = new Schema(entity, schema);
    Object.defineProperty(entity, 'schema', { value: schema });

    const proxy = createProxyEntityClass.call(null, entity);
    Object.defineProperty(entity, 'proxy', { value: proxy });

    const table = memory.createTable(entity);
    Object.defineProperty(entity, 'memory', { value: table });

    library.add(entity);
    return proxy;
};

const createEntityClass = (name, Parent) => {
    return class Entity extends Parent {
        constructor(params = {}) {
            if (params.ƒ_entity) params = params.serialize({ populate: false });
            const props = {};

            for (let index = 0, keys = Object.keys(params), length = keys.length; index < length; index++) {
                if (Entity.schema.get(keys[index], false)) continue;
                props[keys[index]] = params[keys[index]];
                delete params[keys[index]];
            }
            super(props);
            for (let index = 0, fields = Entity.schema.fields, length = fields.length; index < length; index++) {
                this.ƒ_properties.set(
                    fields[index].key,
                    new Property(this, fields[index])
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
    };
};

const createProxyEntityClass = (model) => {
    return new Proxy(model, {
        construct(target, args) {
            const props = args.shift() || {};
            const entity = new target(props, ...args);

            const memory = entity.constructor.memory;
            if (props.uuid) memory.update(entity.serialize({ populate: false }));
            else memory.create(entity.serialize({ populate: false }));
            entity.on('change', ({ key, value, previous }) => {
                if (!model.schema.get(key)) return;
                if (value === previous) return;
                memory.update(entity.serialize({ populate: false }));
            });

            return new Proxy(entity, {
                has(target, property) {
                    return model.schema.has(property);
                },
                get(target, property) {
                    const field = model.schema.get(property);
                    if (typeof property === 'string' && field) {
                        if (target[property]) {
                            throw new Error(`Property ${property} is defined in schema and class ${model.name}`);
                        }
                        return entity.get(property);
                    } else if (property instanceof RegExp && field) {
                        return entity.get(property);
                    }
                    return target[property];
                },
                set(target, property, value) {
                    const field = model.schema.get(property);
                    if (typeof property === 'string' && field) {
                        if (target[property]) {
                            throw new Error(`Property ${property} is defined in schema and class ${model.name}`);
                        }
                        entity.set(property, value);
                        return true;
                    }
                    target[property] = value;
                    return true;
                },
            });
        }
    });
};
