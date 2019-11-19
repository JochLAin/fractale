const logger = require('crieur');
const { DetailedError } = require('../error');
const { Author, Book, Library } = require('../models');
module.exports.models = [Library];

module.exports.title = 'Error tests';
module.exports.name = 'error_test';
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
        if (error.message !== `Expecting "Book.title" to be string || undefined but get 'number'`) {
            throw new DetailedError(`Error on error message for incorrect simple type`, `Expected: Expecting "Book.title" to be string || undefined but get 'number'\n     got: ${error.message}`);
        }
    }

    try {
        library.books = [12];
    } catch (error) {
        if (error.name !== 'IncorrectTypeError') throw error;
        if (error.message !== `Expecting "Library.books" to be array of Book || uuid || undefined but get 'number'`) {
            throw new DetailedError(`Error on error message for incorrect model type`, `Expected: Expecting "Library.books" to be array of Book || uuid || undefined but get 'number'\n     got: ${error.message}`);
        }
    }

    resolve(library.serialize());
};
