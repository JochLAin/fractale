
const Model = require('../../factory');

module.exports.title = 'Test compound inception model'

module.exports.promise = new Promise((resolve, reject) => {
    const Alert = Model.create('Alert', {
        text: String,
        level: String
    });
    const Flashbag = Model.create('Flashbag', {
        alerts: [Alert]
    });

    const flashbag = new Flashbag({
        alerts: [
            { text: 'Hello world !', level: 'info' },
            { text: 'How are you world ?', level: 'warning' },
            { text: 'Good bye world !', level: 'danger' }
        ]
    });

    if (flashbag.alert(0).text !== 'Hello world !') {
        return reject(new Error('Error on compound inception accessor'));
    }

    if (!flashbag.serialize()) {
        return reject(new Error('Error on compound inception serialize'));
    }

    resolve();
});
