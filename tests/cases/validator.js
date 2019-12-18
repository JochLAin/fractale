const moment = require('moment');
const Fractale = require('../../lib');
const Type = require('../../lib/property/types');
const _ = require('../utils');

module.exports.title = 'Validator test';
module.exports.name = 'validator';
module.exports.tutorialized = false;

module.exports.create = () => {
    const Example = Fractale.create('Validator_Example', {
        mixed: Fractale.with(undefined, { required: true, validator: { in: ['foo', 42] } }),
        number: Fractale.with(Number, { validator: { gte: 18, lt: 51, between: [20, 30] } }),
        date: Fractale.with(Date, { validator: { gt: '2016-01-01', lte: new Date('3033-12-31'), between: [moment('2017-01-01')] } })
    });

    return { Example };
};

module.exports.resolver = (resolve) => {
    const { Example } = module.exports.get();

    try {
        new Example();
        throw new Error('Error on validator required');
    } catch (error) {
        if (!(error instanceof Type.ValidatorError)) throw error;
        const message = 'Error in validator "required"\nExpected value to be define but got undefined';
        if (error.message !== message) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    new Example({ mixed: 'foo' });

    try {
        new Example({ mixed: 'bar' });
        throw new Error('Error on validator in');
    } catch (error) {
        if (!(error instanceof Type.ValidatorError)) throw error;
        const message = 'Error in validator "in"\nExpected value in [foo, 42] but got bar';
        if (error.message !== message) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    try {
        new Example({ mixed: 'foo', number: 52 });
        throw new Error('Error on validator.lt number');
    } catch (error) {
        if (!(error instanceof Type.ValidatorError)) throw error;
        const message = 'Error in validator "lt"\nExpected value lower than 51 but got 52';
        if (error.message !== message) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    new Example({ mixed: 'foo', number: 22 });
    try {
        new Example({ mixed: 'foo', number: 16 });
        throw new Error('Error on validator.gte number');
    } catch (error) {
        if (!(error instanceof Type.ValidatorError)) throw error;
        const message = 'Error in validator "gte"\nExpected value greater than or equal 18 but got 16';
        if (error.message !== message) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    try {
        new Example({ mixed: 'foo', number: 19 });
        throw new Error('Error on validator.between number');
    } catch (error) {
        if (!(error instanceof Type.ValidatorError)) throw error;
        const message = 'Error in validator "between"\nExpected value between 20 and 30 but got 19';
        if (error.message !== message) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    try {
        new Example({ mixed: 'foo', number: 45 });
        throw new Error('Error on validator number');
    } catch (error) {
        if (!(error instanceof Type.ValidatorError)) throw error;
        const message = 'Error in validator "between"\nExpected value between 20 and 30 but got 45';
        if (error.message !== message) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    new Example({ mixed: 'foo', date: '2018-01-01' });
    try {
        new Example({ mixed: 'foo', date: '2000-01-01' });
        throw new Error('Error on validator date');
    } catch (error) {
        if (!(error instanceof Type.ValidatorError)) throw error;
        const message = 'Error in validator "gt"\nExpected value greater than 01/01/2016-00:00:00 but got 01/01/2000-00:00:00';
        if (error.message !== message) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    try {
        new Example({ mixed: 'foo', date: '3053-01-01' });
        throw new Error('Error on validator date');
    } catch (error) {
        if (!(error instanceof Type.ValidatorError)) throw error;
        const message = 'Error in validator "lte"\nExpected value lower than or equal to 31/12/3033-01:00:00 but got 01/01/3053-00:00:00';
        if (error.message !== message) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    try {
        new Example({ mixed: 'foo', date: '3023-01-01' });
        throw new Error('Error on validator date');
    } catch (error) {
        if (!(error instanceof Type.ValidatorError)) throw error;
        const message = /^Error in validator "between"(\r\n|\r|\n)Expected value between 01\/01\/2017-00:00:00 and ([0-9\-:/]+) but got 01\/01\/3023-00:00:00$/gm;
        if (!error.message.match(message)) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    try {
        new Example({ mixed: 'foo', date: '2016-11-30' });
        throw new Error('Error on validator date');
    } catch (error) {
        if (!(error instanceof Type.ValidatorError)) throw error;
        const message = /^Error in validator "between"(\r\n|\r|\n)Expected value between 01\/01\/2017-00:00:00 and ([0-9\-:/]+) but got 30\/11\/2016-00:00:00$/gm;
        if (!error.message.match(message)) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    resolve();
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};
