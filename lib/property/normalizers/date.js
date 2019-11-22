const moment = require('moment');
const Options = require('../../options');
const MixedNormalizer = require('./mixed');

module.exports = class DateNormalizer extends MixedNormalizer {
    static normalize(field, next, previous) {
        if (!next) return undefined;
        return moment(next).toISOString();
    }

    static denormalize(field, next, previous) {
        if (!next) return undefined;
        if (Options.get('moment')) {
            return moment(next);
        }
        return new Date(next);
    }
};
