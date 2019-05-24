
const {SELF} = require('./constants');
const factory = require('./factory');
const library = require('./library');
const Model = require('./model');

let _ModelClass = Model;

/**
 * @exports Fractale
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = {
    /**
     * @param {String} SELF - Keyword used for self-referenced model
     */
    SELF,

    /**
     * @param {Factory} factory - Factory use to create models
     */
    factory,

    /**
     * @param {Library} library - Library that register models
     */
    library,

    /**
     * Proxy to factory create function
     * @method
     * @see Factory
     */
    create: factory.create.bind(factory),

    /**
     * Proxy to library all function
     * @method
     * @see Library
     */
    all: library.all.bind(library),

    /**
     * Proxy to library get function
     * @method
     * @see Library
     */
    get: library.get.bind(library),

    /**
     * Base class that model will inherit
     * @param ModelClass
     */
    set ModelClass(ModelClass) {
        if (!(ModelClass instanceof Model)) {
            throw new Error('Your model class must inherit "Fractale.Model" class');
        }
        _ModelClass = ModelClass;
    },
    get ModelClass() {
        return _ModelClass;
    },

    /**
     * Helper to use options in schema
     *
     * @param type
     * @param options
     * @returns {{__options: *, __type: *}}
     * @method
     */
    with: (type, options) => ({
        __type: type,
        __options: options
    }),
};
