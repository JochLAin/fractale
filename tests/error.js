
class DetailedError extends Error {
    constructor(message, detail) {
        super();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DetailedError);
        }
        this.name = 'DetailedError';
        this.message = message;
        this.detail = detail;
    }
}
module.exports.DetailedError = DetailedError;
