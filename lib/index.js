const { SELF } = require('./constants');
const factory = require('./factory');
const library = require('./library');
const Model = require('./model');

let _ModelClass = Model;

module.exports = {
    SELF,

    factory,
    library,

    create: factory.create.bind(factory),
    all: library.all.bind(library),
    get: library.get.bind(library),

    Model,
    set ModelClass(baseModelClass) {
        if (!(baseModelClass instanceof Model)) {
            throw new Error('Your model class must inherit "Fractale.Model" class');
        }
        _ModelClass = baseModelClass;
    },

    get ModelClass() {
        return _ModelClass;
    },

    with: (type, options) => ({
        __type: type,
        __options: options
    }),
};
