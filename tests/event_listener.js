const { Author } = require('./models');

module.exports.title = 'Event listener tests';
module.exports.name = 'event_listener_test';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
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
