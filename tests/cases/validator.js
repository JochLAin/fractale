const moment = require('moment');
const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'Validator test';
module.exports.name = 'validator';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const { Example } = module.exports.get();

    new Example({ mixed: 'foo' });
    try {
        new Example({ mixed: 'bar' });
        throw new Error('Error on validator in');
    } catch (error) {
        if (error instanceof _.TestValidatorError) throw error;
        const message = 'Expected value in ["foo",42], got "bar"';
        if (error.message !== message) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    new Example({ number: 22 });
    try {
        new Example({ number: 16 });
        throw new _.TestValidatorError('Error on validator number');
    } catch (error) {
        if (error instanceof _.TestValidatorError) throw error;
        const message = 'Expected value greater than or equal to 18, got 16';
        if (error.message !== message) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    try {
        new Example({ number: 52 });
        throw new _.TestValidatorError('Error on validator number');
    } catch (error) {
        if (error instanceof _.TestValidatorError) throw error;
        const message = 'Expected value lower than 51, got 52';
        if (error.message !== message) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    try {
        new Example({ number: 19 });
        throw new _.TestValidatorError('Error on validator number');
    } catch (error) {
        if (error instanceof _.TestValidatorError) throw error;
        const message = 'Expected value between 20 and 30, got 19';
        if (error.message !== message) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    try {
        new Example({ number: 45 });
        throw new _.TestValidatorError('Error on validator number');
    } catch (error) {
        if (error instanceof _.TestValidatorError) throw error;
        const message = 'Expected value between 20 and 30, got 45';
        if (error.message !== message) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    new Example({ date: '2018-01-01' });
    try {
        new Example({ date: '2000-01-01' });
        throw new _.TestValidatorError('Error on validator date');
    } catch (error) {
        if (error instanceof _.TestValidatorError) throw error;
        const message = 'Expected value greater than 2015-12-31T23:00:00.000Z, got "2000-01-01"';
        if (error.message !== message) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    try {
        new Example({ date: '3053-01-01' });
        throw new _.TestValidatorError('Error on validator date');
    } catch (error) {
        if (error instanceof _.TestValidatorError) throw error;
        const message = 'Expected value lower than or equal to 3033-12-31T00:00:00.000Z, got "3053-01-01"';
        if (error.message !== message) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    try {
        new Example({ date: '3023-01-01' });
        throw new _.TestValidatorError('Error on validator date');
    } catch (error) {
        if (error instanceof _.TestValidatorError) throw error;
        const message = /^Expected value between 2016-12-31T23:00:00.000Z and ([a-zA-Z0-9\.\-: ]+), got "3023-01-01"$/;
        if (!error.message.match(message)) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    try {
        new Example({ date: '2016-11-30' });
        throw new _.TestValidatorError('Error on validator date');
    } catch (error) {
        if (error instanceof _.TestValidatorError) throw error;
        const message = /^Expected value between 2016-12-31T23:00:00.000Z and ([a-zA-Z0-9\.\-: ]+), got "2016-11-30"$/;
        if (!error.message.match(message)) {
            throw new _.TestError('Invalid validator message', error.message, message);
        }
    }

    resolve();
};

module.exports.create = () => {
    const Example = Fractale.create('Validator_Example', {
        mixed: Fractale.with(undefined, { validator: { in: ['foo', 42] }}),
        number: Fractale.with(Number, { validator: { gte: 18, lt: 51, between: [20, 30] }}),
        date: Fractale.with(Date, { validator: { gt: '2016-01-01', lte: new Date('3033-12-31'), between: [moment('2017-01-01')] }})
    });

    return { Example };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};
