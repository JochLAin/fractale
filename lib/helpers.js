/**
 * Module helpers
 * @module helpers
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */

/**
 * Base 64 helper
 * @memberof helpers
 */
module.exports.base64 = require('./utils/base64');

/**
 * Color helper
 * @memberof helpers
 */
try {
    module.exports.Color = require('teinte');
} catch (error) {}

/**
 * Percent field helper
 * @memberof helpers
 */
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

module.exports.storages = {
    cookie: require('./utils/storage/cookie'),
    local: require('./utils/storage/local'),
    session: require('./utils/storage/session'),
};
