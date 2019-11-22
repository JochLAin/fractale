const Collection = require('../collection');
const MixedPropertyDefiner = require('./mixed');

module.exports = class ArrayPropertyDefiner extends MixedPropertyDefiner {
    static get(property) {
        const value = property.denormalize(property.value);
        return new Collection(property, value);
    }
};
