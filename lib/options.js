const options = {
    moment: true,
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
                module.exports(key, options[key]);
            }
        }
    }
};
