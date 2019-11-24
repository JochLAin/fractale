const library = require('./library');
const memory = require('./memory');
const models = require('./model');
const Schema = require('./property/schema');

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

        const entity = createEntityClass.call(this, name, model);
        Object.defineProperty(entity, 'ƒ_model', { value: true });
        Object.defineProperty(entity, 'entity', { value: entity });
        Object.defineProperty(entity, 'name', { value: name });
        Object.defineProperty(entity, 'parent', { value: parent });
        Object.defineProperty(entity, 'slug', { value: name.toLowerCase() });
        Object.defineProperty(entity, 'virtual', { value: !!options.virtual });

        schema = new Schema(entity, schema);
        Object.defineProperty(entity, 'schema', { value: schema });

        const proxy = createProxyEntityClass.call(this, entity);
        Object.defineProperty(entity, 'proxy', { value: proxy });

        const table = memory.createTable(entity);
        Object.defineProperty(entity, 'memory', { value: table });

        library.add(entity);
        return proxy;
    }
}

const createEntityClass = (name, Parent) => {
    return class Entity extends Parent {
        constructor(params = {}) {
            if (params.ƒ_entity) params = params.serialize({ populate: false });
            const props = {};
            for (const key in params) {
                if (!params.hasOwnProperty(key)) continue;
                if (Entity.schema.has(key, false)) {
                    params[key] = Entity.schema.get(key, false).deserialize(params[key]);
                } else {
                    props[key] = params[key];
                    delete params[key];
                }
            }

            super(props);
            Entity.schema.instantiate(this);
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
                if (!entity.ƒ_properties.has(key)) return;
                if (value === previous) return;
                memory.update(entity.serialize({ populate: false }));
            });

            return new Proxy(entity, {
                has(target, property) {
                    return entity.ƒ_properties.has(property);
                },
                get(target, property) {
                    if (typeof property === 'string' && entity.ƒ_properties.has(property)) {
                        if (target[property]) {
                            throw new Error(`Property ${property} is defined in schema and class ${model.name}`);
                        }
                        return entity.ƒ_properties.get(property).get();
                    }
                    return target[property];
                },
                set(target, property, value) {
                    if (typeof property === 'string' && entity.ƒ_properties.has(property) && !target[property]) {
                        if (target[property]) {
                            throw new Error(`Property ${property} is defined in schema and class ${model.name}`);
                        }
                        entity.ƒ_properties.get(property).set(value);
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
