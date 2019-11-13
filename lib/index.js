const { SELF, TYPE_KEY, OPTIONS_KEY } = require('./constants');
const factory = require('./factory');
const library = require('./library');
const memory = require('./memory');

/**
 * Base class that model will inherit
 */
let Model = require('./model');

/**
 * Module endpoint
 *
 * @class Fractale
 * @param {String} SELF - Keyword used for self-referenced model
 * @param {Factory} factory - Factory that create models
 * @param {Library} library - Library that register models
 * @param {Memory} memory - Memory that register model instances
 * @param {Model} Model - Base class for models
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
class Fractale {
    static Model = require('./model');

    constructor() {
        this.SELF = SELF;
        this.factory = factory;
        this.library = library;
        this.memory = memory;

        this.check = factory.check.bind(factory);
        this.create = factory.createModel.bind(factory);
        this.get = memory.get.bind(memory);

        Object.defineProperty(this, 'Model', {
            get() {
                return Model;
            },
            set(_Model) {
                if (!(_Model.prototype instanceof require('./model'))) {
                    throw new Error('Your model class must inherit "Fractale.Model" class');
                }
                Model = _Model;
            }
        });
    }

    /**
     * Create a type with model create after call
     * @method
     * @see Factory
     */
    from(name) {
        return this.with(undefined, { type: name });
    }

    /**
     * Helper to use options in schema
     *
     * @param {undefined|null|Boolean|Number|String|Model|Array|Object} type - Property type
     * @param {Object} options - Options pass to type
     */
    with(type, options) {
        return {
            [TYPE_KEY]: type,
            [OPTIONS_KEY]: options
        };
    }

    stringify(Entity, ...args) {
        const dependencies = {};

        const single = (value) => {
            switch (value) {
                case null: return "{{mixed}}";
                case undefined: return "{{mixed}}";
                case Boolean: return "{{Boolean}}";
                case Number: return "{{Number}}";
                case String: return "{{String}}";
                case SELF: return "{{Fractale.SELF}}";
                default: {
                    if (value.prototype instanceof Model) {
                        if (!dependencies[value.name]) {
                            Object.assign(dependencies, {
                                [value.name]: stringify(value),
                            });
                        }
                        return `{{${value.name}}}`;
                    }
                    if (typeof value == 'object') {
                        if (Array.isArray(value)) {
                            return value.map((item) => single(item));
                        }
                        return loop(value);
                    }
                    return value;
                }
            }
        };

        const loop = (Entity) => {
            let schema = Entity;
            if (Entity.prototype instanceof Model) {
                schema = Entity.schema;
            }

            return Object.keys(schema).reduce((accu, key) => {
                return Object.assign({}, accu, {
                    [key]: single(schema[key])
                });
            }, {});
        };

        const stringify = (Entity) => {
            const schema = JSON.stringify(loop(Entity), ...args)
                .replace(/"{{/g, '')
                .replace(/}}"/g, '')
            ;
            return `const ${Entity.name} = Fractale.create("${Entity.name}", ${schema});`;
        };

        return [].concat(stringify(Entity), Object.values(dependencies).reverse()).reverse().join("\n\n");
    }
}

module.exports = new Fractale();
