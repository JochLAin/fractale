const moment = require('moment');
const { DetailedError } = require('../error');
const Fractale = require('../../lib');

const Example_Validator = Fractale.create('Example_Validator', {
    mixed: Fractale.with(undefined, { validator: { in: ['foo', 42] }}),
    number: Fractale.with(Number, { validator: { gte: 18, lt: 51, between: [20, 30] }}),
    date: Fractale.with(Date, { validator: { gt: '2016-01-01', lte: new Date('3033-12-31'), between: [moment('2017-01-01')] }})
});

module.exports.models = [Example_Validator];
module.exports.title = 'Validator test';
module.exports.name = 'validator-test';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    new Example_Validator({ mixed: 'foo' });
    try {
        new Example_Validator({ mixed: 'bar' });
        throw new DetailedError('Error on validator in');
    } catch (error) {
        if (error instanceof DetailedError) throw error;
        const message = 'Expected value in ["foo",42], got "bar"';
        if (error.message !== message) {
            throw new DetailedError('Invalid validator message', `Expected: ${message}\nGot: ${error.message}`);
        }
    }

    new Example_Validator({ number: 22 });
    try {
        new Example_Validator({ number: 16 });
        throw new DetailedError('Error on validator number');
    } catch (error) {
        if (error instanceof DetailedError) throw error;
        const message = 'Expected value greater than or equal to 18, got 16';
        if (error.message !== message) {
            throw new DetailedError('Invalid validator message', `Expected: ${message}\nGot: ${error.message}`);
        }
    }

    try {
        new Example_Validator({ number: 52 });
        throw new DetailedError('Error on validator number');
    } catch (error) {
        if (error instanceof DetailedError) throw error;
        const message = 'Expected value lower than 51, got 52';
        if (error.message !== message) {
            throw new DetailedError('Invalid validator message', `Expected: ${message}\nGot: ${error.message}`);
        }
    }

    try {
        new Example_Validator({ number: 19 });
        throw new DetailedError('Error on validator number');
    } catch (error) {
        if (error instanceof DetailedError) throw error;
        const message = 'Expected value between 20 and 30, got 19';
        if (error.message !== message) {
            throw new DetailedError('Invalid validator message', `Expected: ${message}\nGot: ${error.message}`);
        }
    }

    try {
        new Example_Validator({ number: 45 });
        throw new DetailedError('Error on validator number');
    } catch (error) {
        if (error instanceof DetailedError) throw error;
        const message = 'Expected value between 20 and 30, got 45';
        if (error.message !== message) {
            throw new DetailedError('Invalid validator message', `Expected: ${message}\nGot: ${error.message}`);
        }
    }

    new Example_Validator({ date: '2018-01-01' });
    try {
        new Example_Validator({ date: '2000-01-01' });
        throw new DetailedError('Error on validator date');
    } catch (error) {
        if (error instanceof DetailedError) throw error;
        const message = 'Expected value greater than 2015-12-31T23:00:00.000Z, got "2000-01-01"';
        if (error.message !== message) {
            throw new DetailedError('Invalid validator message', `Expected: ${message}\nGot: ${error.message}`);
        }
    }

    try {
        new Example_Validator({ date: '3053-01-01' });
        throw new DetailedError('Error on validator date');
    } catch (error) {
        if (error instanceof DetailedError) throw error;
        const message = 'Expected value lower than or equal to 3033-12-31T00:00:00.000Z, got "3053-01-01"';
        if (error.message !== message) {
            throw new DetailedError('Invalid validator message', `Expected: ${message}\nGot: ${error.message}`);
        }
    }

    try {
        new Example_Validator({ date: '3023-01-01' });
        throw new DetailedError('Error on validator date');
    } catch (error) {
        if (error instanceof DetailedError) throw error;
        const message = /^Expected value between 2016-12-31T23:00:00.000Z and ([a-zA-Z0-9\.\-: ]+), got "3023-01-01"$/;
        if (!error.message.match(message)) {
            throw new DetailedError('Invalid validator message', `Expected: ${message.toString()}\nGot: ${error.message}`);
        }
    }

    try {
        new Example_Validator({ date: '2016-11-30' });
        throw new DetailedError('Error on validator date');
    } catch (error) {
        if (error instanceof DetailedError) throw error;
        const message = /^Expected value between 2016-12-31T23:00:00.000Z and ([a-zA-Z0-9\.\-: ]+), got "2016-11-30"$/;
        if (!error.message.match(message)) {
            throw new DetailedError('Invalid validator message', `Expected: ${message.toString()}\nGot: ${error.message}`);
        }
    }

    resolve();
};
