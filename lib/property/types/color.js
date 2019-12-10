'use strict';

const ƒ_type = require('./index');

module.exports = class ƒ_color extends ƒ_type {
    static evaluate(input, type) {
        return type === 'string' && input.toLowerCase() === 'color'
            || type === 'function' && input === getColor()
        ;
    }

    static get priority() {
        return 2;
    }

    expose(property) {
        return property.value === undefined ? property.value : getColor().fromHex(property.value);
    }

    flatten(value) {
        console.log(value);
        console.log(getColor().toHex(value));
        return value === undefined ? value : getColor().toHex(value);
    }

    shape(value, options) {
        return value === undefined ? value : getColor().toHex(value);
    }

    parseValidator(validator) {
        return super.parseValidator(validator);
    }

    validate(value) {
        if (value === undefined) return;
        if (!getColor().test(value)) {
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
        return getColor().name;
    }
};

const getColor = () => {
    return require('../../utils/color');
};
