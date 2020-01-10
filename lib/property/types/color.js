const { stringify } = require('../../utils');
const ƒ_type = require('./index');

let Color;
module.exports = class ƒ_color extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, Color, input, options);
    }

    static evaluate(input, type) {
        if (!Color) Color = require('teinte');
        return type === 'string' && (input.toLowerCase() === 'color')
            || type === 'function' && input === Color
            || input && Color.test(input)
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
        if (this.options.required && value === undefined || value === null) {
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

    toBasic(replacer) {
        const value = String;
        if (replacer instanceof Function) return replacer(value, this);
        return value;
    }

    toJSON() {
        if (Object.keys(this.options).length) {
            return `Fractale.with(${Color.name}, ${stringify(this.options)})`;
        }
        return Color.name;
    }
};
