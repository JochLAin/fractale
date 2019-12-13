module.exports.then = (value, callback) => {
    if (!callback) callback = result => result;
    if (Array.isArray(value)) {
        if (value.every(v => v instanceof Promise)) {
            return Promise.all(value).then(callback);
        }
    } else if (value instanceof Promise) {
        return value.then(callback);
    }
    return callback(value);
};
