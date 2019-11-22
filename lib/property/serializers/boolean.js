const MixedSerializer = require('./mixed');

module.exports = class BooleanSerializer extends MixedSerializer {
    static deserialize(field, value) {
        return value === undefined ? value : Boolean(value);
    }

    static serialize(field, value, options = {}) {
        return value === undefined ? value : Boolean(value);
    }
};
