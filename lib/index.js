
const Model = require('./model');
const { SELF } = require('./constants');

/**
 * Base class that model will inherit
 */
let _ModelClass = Model;

/**
 * @exports Fractale
 * @param {String} SELF - Keyword used for self-referenced model
 * @param {Factory} factory - Factory use to create models
 * @param {Library} library - Library that register models
 * @param {ModelClass} ModelClass - Base class for models
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = new (class Fractale {
    constructor() {
        this.SELF = SELF;
        this.factory = require('./factory');
        this.library = require('./library');

        Object.defineProperty(this, 'ModelClass', {
            get() {
                return _ModelClass;
            },
            set(ModelClass) {
                if (!(ModelClass.prototype instanceof Model)) {
                    throw new Error('Your model class must inherit "Fractale.ModelClass" class');
                }
                _ModelClass = ModelClass;
            }
        });
    }

    /**
     * Proxy to factory create function
     * @method
     * @see Factory
     */
    create() {
        return this.factory.create.apply(this.factory, arguments)
    }

    /**
     * Proxy to library to get a model by its name
     * @method
     * @see Library
     * @see Encyclopedia
     */
    get(name) {
        const encyclopedia = this.library.get(name);
        return encyclopedia && encyclopedia.model;
    }

    /**
     * Helper to use options in schema
     *
     * @param {undefined|null|Boolean|Number|String|ModelClass|Array|Object} type - Property type
     * @param {Object} options - Options pass to type
     * @returns {{__type: *, __options: *}}
     */
    with(type, options) {
        return {
            __type: type,
            __options: options
        };
    };

    stringify(Model, ...args) {
        const dependencies = {};

        const single = (value) => {
            switch (value) {
                case null: return "{{mixed}}";
                case undefined: return "{{mixed}}";
                case Boolean: return "{{Boolean}}";
                case Number: return "{{Number}}";
                case String: return "{{String}}";
                case SELF: return "{{Fractale.SELF}}";
                default:
                    if (value.prototype instanceof _ModelClass) {
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
        };

        const loop = (Model) => {
            let schema = Model;
            if (Model.prototype instanceof _ModelClass) {
                const encyclopedia = this.library.get(Model.name);
                schema = encyclopedia.schema;
            }

            return Object.keys(schema).reduce((accu, key) => {
                return Object.assign({}, accu, {
                    [key]: single(schema[key])
                });
            }, {});
        };

        const stringify = (Model) => {
            const schema = JSON.stringify(loop(Model), ...args).replace(/"{{/g, '').replace(/}}"/g, '');
            return `const ${Model.name} = Fractale.create("${Model.name}", ${schema});`;
        };

        return [].concat(stringify(Model), Object.values(dependencies).reverse()).reverse().join("\n\n");
    }
})();
