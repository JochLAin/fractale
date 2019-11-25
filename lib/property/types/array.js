const Collection = require('../collection');
const MixedType = require('./mixed');

module.exports = class ArrayType extends MixedType {
    static createIncorrectItemTypeError(error) {
        const expected = `array of ${error.expected}`;
        const type = `array of ${error.type}`;
        throw ArrayType.createIncorrectTypeError(error.field, expected, type, true);
    };

    static get(property) {
        const value = property.denormalize(property.value);
        return new Collection(property, value);
    }

    static normalize(field, next, previous) {
        return (next || []).map((item) => {
            return field.options.item.normalize(item);
        });
    }

    static denormalize(field, next, previous) {
        return (next || []).map((item) => {
            return field.options.item.denormalize(item);
        });
    }

    static deserialize(field, value) {
        if (!value) return [];
        const data = [];
        for (let index = 0, length = value.length; index < length; index++) {
            data.push(field.options.item.deserialize(value[index]));
        }
        return data;
    }

    static serialize(field, value, options = {}) {
        if (!value) return [];
        options = Object.assign({}, options, { depth: options.depth - 1 });
        const data = [];
        for (let index = 0, length = value.length; index < length; index++) {
            data.push(field.options.item.serialize(value[index], options));
        }
        return data;
    }

    static validate(field, value) {
        if (!value) return;
        if (!Array.isArray(value)) {
            throw ArrayType.createIncorrectTypeError(field, 'array', value);
        }

        for (let index = 0, length = value.length; index < length; index++) {
            try {
                field.options.item.validate(value[index]);
            } catch (error) {
                if (!(error instanceof MixedType.IncorrectTypeError)) throw error;
                if (error.field.key !== field.key) throw error;
                throw ArrayType.createIncorrectItemTypeError(error);
            }
        }
    }
};
