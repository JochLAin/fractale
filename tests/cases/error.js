const _ = require('../utils');
const { Author, Book, Library } = require('../models');
module.exports.models = [Library];

module.exports.title = 'Error tests';
module.exports.name = 'error-test';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const author = new Author({ firstname: 'Ito', lastname: 'Ōgure', surname: 'Oh! Great', comment: 'N/A' });
    const book = new Book({ title: 'Air gear', readable: true, author: author });
    const library = new Library({ books: [book, { title: 'Tenjo tenge', readable: false, author: author }] });

    try {
        book.title = 69;
    } catch (error) {
        if (error.name !== 'IncorrectTypeError') throw error;
        _.test(error.message, `Expecting "Book.title" to be string || undefined but get 'number'`, `Error on error message for incorrect simple type`);
    }

    try {
        library.books = [12];
    } catch (error) {
        if (error.name !== 'IncorrectTypeError') throw error;
        _.test(error.message, `Expecting "Library.books[0]" to be Book || uuid || undefined but get 'number'`, `Error on error message for incorrect model type`);
    }

    resolve(library);
};
