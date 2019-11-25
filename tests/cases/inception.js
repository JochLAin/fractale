const _ = require('../utils');
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
    _.test(book.author.comment, 'N/A', 'Error on inception setter with dot');

    const author = book.author;
    const value = 'I love this author';
    author.comment = value;

    _.test(book.author.comment, value, 'Error on inception setter with dot');

    book.author.comment = 'N/A';
    _.test(book.author.comment, 'N/A', 'Error on deep setter with dot');

    resolve(book);
};
