let moment;
try { moment = require('moment'); } catch (error) {}

const options = {
    use_moment: !!moment,
    flat_regexp: true,
    cookie_expires: 6048e5,
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
            if (Object.prototype.hasOwnProperty.call(options, key)) {
                module.exports.set(key, options[key]);
            }
        }
    }
};
