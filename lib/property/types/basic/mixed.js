'use strict';

const ƒ_type = require('../base');

/**
 * Define property on an instance of Model
 *
 * @class ƒ_mixed
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class ƒ_mixed extends ƒ_type {
    constructor(field, input) {
        super(field, input);
        this.value = undefined;
    }

    static evaluate(input, type) {
        return input === null || input === undefined;
    }
};
