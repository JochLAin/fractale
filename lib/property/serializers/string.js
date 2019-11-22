const MixedSerializer = require('./mixed');

module.exports = class StringSerializer extends MixedSerializer {
    static deserialize(field, value) {
        return value === undefined ? value : String(value);
    }

    static serialize(field, value, options = {}) {
        return value === undefined ? value : String(value);
    }
};
