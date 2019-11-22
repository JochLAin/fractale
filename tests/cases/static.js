const { DetailedError } = require('../error');
const { Book } = require('../models');
module.exports.models = [Book];

module.exports.title = 'Static method test';
module.exports.name = 'static-test';
module.exports.tutorialized = false;

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

    const clone = Book.from(book);
    clone.readable = false;

    if (book.title !== 'Air gear') {
        throw new DetailedError('Error on static method from', `Expected "Air gear" got "${book.title}"`);
    }
    if (clone.title !== 'Air gear') {
        throw new DetailedError('Error on static method from', `Expected "Air gear" got "${clone.title}"`);
    }
    if (!book.readable) {
        throw new DetailedError('Error on static method from', `Expected "true" got "${book.readable}"`);
    }
    if (clone.readable) {
        throw new DetailedError('Error on static method from', `Expected "false" got "${clone.readable}"`);
    }
    resolve(clone);
};
