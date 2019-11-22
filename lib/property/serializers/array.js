const MixedSerializer = require('./mixed');

module.exports = class ArraySerializer extends MixedSerializer {
    static deserialize(field, value) {
        if (!value) return [];
        const data = [];
        for (let index = 0, length = value.length; index < length; index++) {
            data.push(field.options.subfield.deserialize(value[index], options));
        }
        return data;
    }

    static serialize(field, value, options = {}) {
        if (!value) return [];
        options = Object.assign({}, options, { depth: options.depth - 1 });
        const data = [];
        for (let index = 0, length = value.length; index < length; index++) {
            data.push(field.options.subfield.serialize(value[index], options));
        }
        return data;
    }
};
