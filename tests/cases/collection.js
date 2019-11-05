
const { Author, Book, Library } = require('../models');
module.exports.models = [Library];

module.exports.title = 'Collection model';
module.exports.tutorialized = true;

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

    const timeout = setTimeout(() => {
        throw new Error('Error on change collection item property');
    }, 1000);

    let counter = 0;
    library.addEventListener('change', () => {
        if (++counter >= 2) {
            clearTimeout(timeout);
            resolve(library.serialize());
        }
    });

    library.books[0].title = 'Bakemonogatari';
    library.books.push({
        title: 'Biorg trinity',
        readable: false,
        author: author,
    });

    if (library.books[0].title !== 'Bakemonogatari') {
        throw new Error('Error on collection accessor with brace');
    }
    if (library.books.first().title !== 'Bakemonogatari') {
        throw new Error('Error on array method first accessor');
    }
    if (library.books.last().title !== 'Biorg trinity') {
        throw new Error('Error on array method last accessor');
    }

    if (library.books.map(book => book.title).join(', ') !== 'Bakemonogatari, Tenjo tenge, Biorg trinity') {
        throw new Error('Error on array method map accessor');
    }

    if (library.books.filter(book => book.readable).map(book => book.title).join(', ') !== 'Bakemonogatari') {
        throw new Error('Error on array method filter accessor');
    }

    if (library.books.reduce((accu, book) => `${accu} ${book.title}`, '').trim() !== 'Bakemonogatari Tenjo tenge Biorg trinity') {
        throw new Error('Error on array method reduce accessor');
    }

    library.books.remove(book);
    if (library.books.length !== 2) {
        throw new Error('Error on array method remove accessor');
    }

    if (!library.serialize()) {
        throw new Error('Error on collection serializer');
    }
};
