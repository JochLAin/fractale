const { DetailedError } = require('../error');
const { Author, Book } = require('../models');
module.exports.models = [Book];

module.exports.title = 'Form usage';
module.exports.name = 'form-usage';
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
        title: 'Au-delà de la donnée',
        readable: false,
    });

    if (book.author.firstname !== 'Jocelyn') {
        throw new DetailedError('Error on form setter', `Expected "Jocelyn" got "${book.author.firstname}"`);
    }

    resolve(book);
};
