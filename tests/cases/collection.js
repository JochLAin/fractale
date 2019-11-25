const _ = require('../utils');
const { Author, Book, Library } = require('../models');

module.exports.models = [Library];
module.exports.title = 'Collection model';
module.exports.name = 'collection-model';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const author = new Author({ firstname: 'Ito', lastname: 'Ōgure', surname: 'Oh! Great', comment: 'N/A' });
    const book = new Book({ title: 'Air gear', readable: true, author: author });
    const library = new Library({ books: [book, { title: 'Tenjo tenge', readable: false, author: author }] });

    _.test(library.books[0].title, 'Air gear', 'Error on collection accessor with brace');
    _.test(library.books[1].title, 'Tenjo tenge', 'Error on collection accessor with brace');

    let changed = false;
    library.addEventListener('change', () => changed = true);
    library.books[0].title = 'Bakemonogatari';

    if (!changed) {
        throw new Error('Error on collection change event');
    }
    _.test(library.books[0].title, 'Bakemonogatari', 'Error on collection accessor with brace after change');
    _.test(library.books.first.title, 'Bakemonogatari', 'Error on collection method first accessor');

    library.books.push({ title: 'Biorg trinity', readable: false, author: author });

    _.test(library.books.last.title, 'Biorg trinity', 'Error on collection method last accessor');
    _.test(library.books.map(book => book.title).join(', '), 'Bakemonogatari, Tenjo tenge, Biorg trinity', 'Error on array method map accessor');
    _.test(library.books.filter(book => book.readable).map(book => book.title).join(', '), 'Bakemonogatari', 'Error on array method filter accessor');
    _.test(library.books.reduce((accu, book) => `${accu} ${book.title}`, '').trim(), 'Bakemonogatari Tenjo tenge Biorg trinity', 'Error on array method reduce accessor');

    library.books.remove(book);
    if (library.books.length !== 2) throw new Error('Error on array method remove accessor');

    resolve(library);
};
