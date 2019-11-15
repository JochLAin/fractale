const CONSTANTS = require('./constants');
const factory = require('./factory');
const library = require('./library');
const memory = require('./memory');
const options = require('./options');
const Model = require('./model');

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
    constructor() {
        this.create = factory.createModel.bind(factory);
        this.get = library.get.bind(library);
        this.getOption = options.get.bind(options);
        this.setOption = options.set.bind(options);

        this.from = name => () => this.get(name);
        this.validate = factory.constructor.validate.bind(factory);
        this.with = (type, options) => ({ [CONSTANTS.TYPE_KEY]: type, [CONSTANTS.OPTIONS_KEY]: options });

        Object.defineProperty(this, 'Model', {
            get() {
                return factory.Model;
            },
            set(Model) {
                return factory.Model = Model;
            }
        });
    }

    stringify(model, options = {}) {
        const { space, dependencies } = options;
        if (!dependencies) return Model.stringify(model, space);

        const deps = Model.getDependencies(model);
        return [].concat(Model.stringify(model, space), Object.values(deps).reverse().map(model => Model.stringify(model, space))).reverse().join("\n\n");
    }
}

module.exports = new Fractale();
module.exports.SELF = CONSTANTS.SELF;
module.exports.factory = factory;
module.exports.library = library;
module.exports.memory = memory;
