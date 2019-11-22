const moment = require('moment');
const MixedSerializer = require('./mixed');

module.exports = class DateSerializer extends MixedSerializer {
    static deserialize(field, value) {
        if (!value) return undefined;
        return moment(value).toISOString();
    }

    static serialize(field, value, options = {}) {
        if (!value) return undefined;
        return moment(value).toISOString();
    }
};
