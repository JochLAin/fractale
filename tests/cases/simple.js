
const { Simple } = require('./models');

module.exports.title = 'Test simple model';

module.exports.run = () => new Promise((resolve) => {
    const instance = new Simple({
        mixed: 'It\'s dangerous to go alone! Take this.',
        boolean: true,
        number: 31,
        string: 'Lorem ipsum'
    });

    if (instance.mixed !== 'It\'s dangerous to go alone! Take this.') {
        throw new Error('Error on simple accessor with type mixed');
    }
    if (instance.boolean !== true) {
        throw new Error('Error on simple accessor with type boolean');
    }
    if (instance.number !== 31) {
        throw new Error('Error on simple accessor with type number');
    }
    if (instance.string !== 'Lorem ipsum') {
        throw new Error('Error on simple accessor with type string');
    }

    instance.mixed = -1;
    instance.boolean = false;
    instance.number = 42;
    instance.string = 'Dolores sit amet';

    if (instance.mixed !== -1) {
        throw new Error('Error on simple accessor with type mixed after change');
    }
    if (instance.boolean !== false) {
        throw new Error('Error on simple accessor with type boolean after change');
    }
    if (instance.number !== 42) {
        throw new Error('Error on simple accessor with type number after change');
    }
    if (instance.string !== 'Dolores sit amet') {
        throw new Error('Error on simple accessor with type string after change');
    }

    if (!instance.serialize()) {
        throw new Error('Error on simple serializer');
    }

    resolve();
});
