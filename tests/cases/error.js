
const { Author, Book, Library } = require('../models');
module.exports.models = [Library];

module.exports.title = 'Simple model';
module.exports.tutorialized = true;

class DetailedError extends Error {
    constructor(message, detail, ...props) {
        super(message, ...props);
        this.detail = detail;
    }
}

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
        if (error.name !== 'IncorrectTypeError') {
            throw new DetailedError('Incorrect type error', `  Expected: IncorrectTypeError\n  Receive: ${error.name}`);
        }
        if (error.message !== `Expecting "Book.title" to be string || null but get 'number'`) {
            throw new DetailedError(`Error on error message for incorrect simple type`, `  Expected: Expecting "Book.title" to be string || null but get 'number'\n  Receive: ${error.message}`);
        }
    }

    try {
        library.books = [12];
    } catch (error) {
        if (error.name !== 'IncorrectTypeError') {
            throw new DetailedError('Incorrect type error', `  Expected: IncorrectTypeError\n  Receive: ${error.name}`);
        }
        if (error.message !== `Expecting "Library.books" to be array of Book || uuid || null but get 'number'`) {
            throw new DetailedError(`Error on error message for incorrect simple type`, `  Expected: Expecting "Library.books" to be array of Book || uuid || null but get 'number'\n  Receive: ${error.message}`);
        }
    }

    resolve(library.serialize());
};
