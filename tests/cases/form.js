
const { Author, Book } = require('../models');
module.exports.models = [Book];

module.exports.title = 'Form model';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const author = new Author({
        firstname: 'Jocelyn',
        lastname: 'Faihy',
        surname: 'Jochlain',
        comment: 'Great',
    });

    const book = new Book({
        author: author.uuid,
        readable: false,
        title: 'Au-delà de la donnée'
    });

    if (book.author.firstname !== 'Jocelyn') {
        throw new Error('Error on form setter');
    }
    if (!book.serialize()) {
        throw new Error('Error on form serializer');
    }
    resolve();
};
