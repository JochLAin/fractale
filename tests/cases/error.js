const logger = require('crieur');
const { DetailedError } = require('../error');
const { Author, Book, Library } = require('../models');
module.exports.models = [Library];

module.exports.title = 'Error tests';
module.exports.name = 'error-test';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const author = new Author({
        firstname: 'Ito',
        lastname: 'Ōgure',
        surname: 'Oh! Great',
        comment: 'N/A',
    });

    const book = new Book({
        title: 'Air gear',
        readable: true,
        author: author,
    });

    const library = new Library({
        books: [book, {
            title: 'Tenjo tenge',
            readable: false,
            author: author,
        }]
    });

    try {
        book.title = 69;
    } catch (error) {
        if (error.name !== 'IncorrectTypeError') throw error;
        const message = `Expecting "Book.title" to be string || undefined but get 'number'`;
        if (error.message !== message) {
            throw new DetailedError(`Error on error message for incorrect simple type`, `Expected: ${message}\n     got: ${error.message}`);
        }
    }

    try {
        library.books = [12];
    } catch (error) {
        if (error.name !== 'IncorrectTypeError') throw error;
        const message = `Expecting "Library.books" to be array of Book || uuid || undefined but get array of 'number'`;
        if (error.message !== message) {
            throw new DetailedError(`Error on error message for incorrect model type`, `Expected: ${message}\n     got: ${error.message}`);
        }
    }

    resolve(library);
};
