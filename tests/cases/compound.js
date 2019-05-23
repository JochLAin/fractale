
const { Flashbag } = require('./models');

module.exports.title = 'Test compound model';

module.exports.run = () => new Promise((resolve) => {
    const flashbag = new Flashbag({
        alerts: [
            { text: 'Hello world !', level: 'info' },
            { text: 'How are you world ?', level: 'warning' },
            { text: 'Good bye world !', level: 'danger' }
        ]
    });

    if (flashbag.alert(0).text !== 'Hello world !') {
        throw new Error('Error on compound accessor');
    }

    if (!flashbag.serialize()) {
        throw new Error('Error on compound serialize');
    }

    resolve();
});
