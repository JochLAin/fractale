
const { Simple } = require('../models');
module.exports.models = [Simple];

module.exports.title = 'Simple model';
module.exports.tutorialized = true;

class DetailedError extends Error {
    constructor(message, detail, ...props) {
        super(message, ...props);
        this.detail = detail;
    }
}

module.exports.resolver = (resolve) => {
    const instance = new Simple({
        mixed: 'It\'s dangerous to go alone! Take this.',
        boolean: false,
        number: 31,
        string: 'Lorem ipsum'
    });

    try {
        instance.string = 69;
    } catch (error) {
        if (error.name !== 'IncorrectTypeError') {
            throw new Error('Incorrect type error');
        }
        if (error.message !== `Expecting "Simple.string" to be string || null but get 'number'`) {
            throw new DetailedError(`Error on error message for incorrect simple type`, `  Expected: Expecting "Simple.string" to be string || null but get 'number'\n  Receive: ${error.message}`);
        }
    }

    resolve(instance.serialize());
};
