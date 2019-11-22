const MixedSerializer = require('./mixed');

module.exports = class NumberSerializer extends MixedSerializer {
    static deserialize(field, value) {
        return value === undefined ? value : Number(value);
    }

    static serialize(field, value, options = {}) {
        return value === undefined ? value : Number(value);
    }
};
