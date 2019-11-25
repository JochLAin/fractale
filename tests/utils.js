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
            this.detail = `Expected "${expected}"\nGot "${value}"`;
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

