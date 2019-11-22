const { DetailedError } = require('../error');
const { Book } = require('../models');
module.exports.models = [Book];

module.exports.title = 'Inception model';
module.exports.name = 'inception-model';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const book = new Book({
        author: {
            firstname: 'Ito',
            lastname: 'Ōgure',
            surname: 'Oh! Great',
            comment: 'N/A',
        },
        title: 'Air gear',
        readable: true,
    });
    if (book.author.comment !== 'N/A') {
        throw new DetailedError('Error on inception setter with dot', `Expected "N/A" got "${book.author.comment}"`);
    }

    const author = book.author;
    const value = 'I love this author';
    author.comment = value;
    if (book.author.comment !== value) {
        throw new DetailedError('Error on inception setter with dot', `Expected "${value}" got "${book.author.comment}"`);
    }

    book.author.comment = 'N/A';
    if (book.author.comment !== 'N/A') {
        throw new Error('Error on deep setter with dot');
    }

    resolve(book);
};
