const logger = require('crieur');
const moment = require('moment');

class TestError extends Error {
    constructor(message, value, expected) {
        super();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TestError);
        }
        this.name = 'TestError';
        this.message = message;
        if (String(value).length <= 80 && String(expected).length <= 80) {
            this.detail = `Expected "${expected}" got "${value}"`;
        } else {
            this.detail = `Expected: ${expected}\nGot: ${value}`;
        }
    }
}
class TestValidatorError extends Error {
}

module.exports.TestError = TestError;
module.exports.TestValidatorError = TestValidatorError;
module.exports.test = (value, expected, message) => {
    if (value === expected) return;
    throw new TestError(message, value, expected);
};

module.exports.watch = (callback, title, level = 'debug') => {
    let start = moment();
    if (title) logger.info(`  > ${title}`);
    logger[level](`Start watch ${start.format('HH:mm:ss.SSS')}`);
    callback();
    let end = moment();
    logger[level](`End watch ${end.format('HH:mm:ss.SSS')}`);
    const duration = (end.valueOf() - start.valueOf()) / 1000;
    logger[level](`Duration: ${duration}s`);
    return duration;
};
