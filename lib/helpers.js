'use strict';

module.exports.base64 = require('./utils/base64');

module.exports.Percent = {
    ƒ_type: Number,
    ƒ_options: {
        transform: (value) => {
            if (typeof value !== 'string') return value;
            if (value.indexOf('%') !== (value.length - 1)) return value;
            return Number(value.slice(0, -1)) / 100;
        }
    }
};

module.exports.Color = require('./utils/color');
