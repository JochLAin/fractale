const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'Error tests';
module.exports.name = 'error';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const { Author, Book, Library } = module.exports.get();
    const author = new Author({ firstname: 'Ito', lastname: 'Ōgure', surname: 'Oh! Great', comment: 'N/A' });
    const book = new Book({ title: 'Air gear', readable: true, author: author });
    const library = new Library({ books: [book, { title: 'Tenjo tenge', readable: false, author: author }] });

    try {
        book.title = 69;
    } catch (error) {
        if (error.name !== 'IncorrectTypeError') throw error;
        _.test(error.message, `Expecting "Error_Book.title" to be string || undefined but get 'number'`, `Error on error message for incorrect simple type`);
    }

    try {
        library.books = [12];
    } catch (error) {
        if (error.name !== 'IncorrectTypeError') throw error;
        _.test(error.message, `Expecting "Error_Library.books[0]" to be Error_Book || uuid || undefined but get 'number'`, `Error on error message for incorrect model type`);
    }

    resolve(library);
};

module.exports.create = () => {
    Fractale.create('Error_Chapter', {
        pages: [Fractale.from('Error_Page')],
    });

    Fractale.create('Error_Page', {
        title: String,
        content: String,
    });

    const Author = Fractale.create('Error_Author', {
        firstname: String,
        lastname: String,
        surname: String,
        comment: String,
    });

    const Book = Fractale.create('Error_Book', {
        author: Author,
        readable: Boolean,
        title: String,
        chapters: [Fractale.from('Error_Chapter')]
    });

    const Library = Fractale.create('Error_Library', {
        books: [Book]
    });

    return { Author, Book, Library };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};
