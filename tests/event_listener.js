const Fractale = require('../lib');
const _ = require('./utils');

module.exports.title = 'Event listener tests';
module.exports.name = 'event_listener_test';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const { Author } = module.exports.get();
    const author = new Author({
        firstname: 'Ito',
        lastname: 'Ōgure',
        surname: 'Oh! Great',
        comment: 'N/A',
    });

    let triggered = false;
    author.addEventListener('change', () => {
        triggered = true;
        resolve(author.serialize());
    });

    author.comment = 'Great author';
    setTimeout(() => { if (!triggered) throw new Error('Events are not triggered'); }, 100);
};

module.exports.create = () => {
    const Author = Fractale.create('EventListener_Author', {
        firstname: String,
        lastname: String,
        surname: String,
        comment: String,
    });

    return { Author };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};
