
const { Book } = require('../models');
module.exports.models = [Book];

module.exports.title = 'Inception model';
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
        throw new Error('Error on deep getter with dot');
    }

    const author = book.author;
    author.comment = 'I love this author';
    book.author = author;
    if (book.author.comment !== 'I love this author') {
        throw new Error('Error on inception deep setter with dot');
    }

    book.author.comment = 'N/A';
    if (book.author.comment !== 'N/A') {
        throw new Error('Error on deep setter with dot');
    }

    if (!book.serialize()) {
        throw new Error('Error on inception serializer');
    }
    resolve();
};
