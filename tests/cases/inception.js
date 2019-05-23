
const Fractale = require('../../factory');

module.exports.title = 'Test inception model';

module.exports.run = () => new Promise((resolve, reject) => {
    const Message = Fractale.create('Message', { text: String, priority: Number });
    const Messenger = Fractale.create('Messenger', { message: Message });

    const messenger = new Messenger({
        message: {
            text: 'Hello world !'
        }
    });

    if (messenger.message.text !== 'Hello world !') {
        return reject(new Error('Error on deep getter with dot'));
    }

    const message = messenger.message;
    message.text = 'How are you world ?';
    messenger.message = message;
    if (messenger.message.text !== 'How are you world ?') {
        return reject(new Error('Error on inception deep setter with dot'));
    }

    messenger.message.text = 'Good bye world !';
    if (messenger.message.text !== 'Good bye world !') {
        return reject(new Error('Error on deep setter with dot'));
    }

    if (!messenger.serialize()) {
        return reject(new Error('Error on inception serialize'));
    }
    resolve();
});
