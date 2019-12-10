'use strict';

let moment;
try { moment = require('moment'); } catch (error) {}

const options = {
    use_moment: !!moment,
    flat_regexp: true,
};

module.exports = (name, value) => {
    if (value === undefined) {
        return module.exports.get(name);
    }
    return module.exports.set(name, value);
};

module.exports.get = (name) => {
    return options[name];
};

module.exports.set = (name, value) => {
    if (typeof name === 'string') {
        Object.assign(options, { [name]: value });
    } else {
        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                module.exports.set(key, options[key]);
            }
        }
    }
};
