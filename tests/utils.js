// const moment = require('moment');

class TestError extends Error {
    constructor(message, value, expected) {
        super();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TestError);
        }
        this.name = 'TestError';
        this.message = message;
        if (String(value).length <= 80 && String(expected).length <= 80) {
            this.message += `\nExpected "${expected}" but got "${value}"`;
        } else {
            this.message += `\nExpected: ${expected}\nBut got: ${value}`;
        }
    }
}

class TestValidatorError extends Error {
    constructor(message) {
        super(message);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TestError);
        }
        this.name = 'TestError';
    }
}

module.exports.TestError = TestError;
module.exports.TestValidatorError = TestValidatorError;
module.exports.test = (value, expected, message) => {
    if (value === expected) return;
    throw new TestError(message, value, expected);
};

module.exports.watch = (callback) => {
    // const start = moment();
    callback();
    // const end = moment();
    // return (end.valueOf() - start.valueOf()) / 1000;
    return 0;
};
