const Color = require('../../utils/color');
const ƒ_type = require('./index');

module.exports = class ƒ_color extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, Color, input, options);
    }

    static evaluate(input, type) {
        return type === 'string' && (input.toLowerCase() === 'color')
            || type === 'function' && input === Color
            || Color.test(input)
        ;
    }

    static get priority() {
        return 2;
    }

    expose(property) {
        return property.value === undefined ? property.value : Color.fromHex(property.value);
    }

    flatten(value) {
        return value === undefined ? value : Color.toHex(value);
    }

    shape(value, options) {
        return value === undefined ? value : Color.toHex(value);
    }

    parseValidator(validator) {
        return super.parseValidator(validator);
    }

    validate(value) {
        if (value === undefined) {
            if (!this.options.required) return;
            throw this.createValidatorError('required', value, 'to be define');
        }
        if (!Color.test(value)) {
            throw this.createIncorrectTypeError('Fractale.Color || hex || hsl(a) || rgb(a) || [r, g, b, h, s, l, a] || { r, g, b, h, s, l, a } || undefined', value);
        }

        if (!this.validator) return;
        if (typeof this.validator === 'function') {
            if (!this.validator(value)) {
                throw this.createValidatorError('custom', value, 'validated by custom function');
            }
        }
    }

    toJSON() {
        return Color.name;
    }
};
