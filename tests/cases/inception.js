
const { Messenger, Message } = require('./models');

module.exports.title = 'Test inception model';

module.exports.run = () => new Promise((resolve) => {
    const messenger = new Messenger({
        message: {
            text: 'Hello world !'
        }
    });

    if (messenger.message.text !== 'Hello world !') {
        throw new Error('Error on deep getter with dot');
    }

    const message = messenger.message;
    message.text = 'How are you world ?';
    messenger.message = message;
    if (messenger.message.text !== 'How are you world ?') {
        throw new Error('Error on inception deep setter with dot');
    }

    messenger.message.text = 'Good bye world !';
    if (messenger.message.text !== 'Good bye world !') {
        throw new Error('Error on deep setter with dot');
    }

    if (!messenger.serialize()) {
        throw new Error('Error on inception serialize');
    }
    resolve();
});
