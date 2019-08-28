
const { Library, Author } = require('../models');
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

    const library = new Library({
        books: [{
            title: 'Air gear',
            readable: true,
            author: author,
        }, {
            title: 'Tenjo tenge',
            readable: true,
            author: author,
        }]
    });

    library.books.push({
        title: 'Biorg trinity',
        readable: true,
        author: author,
    });

    if (library.books[0].title !== 'Air gear') {
        throw new Error('Error on collection accessor with brace');
    }
    if (library.props.book(1).title !== 'Tenjo tenge') {
        throw new Error('Error on collection accessor with function singular');
    }
    if (library.books.last().title !== 'Biorg trinity') {
        throw new Error('Error on array methods accessor');
    }

    if (!library.serialize()) {
        throw new Error('Error on collection serializer');
    }

    //*
    const timeout = setTimeout(() => {
        throw new Error('Error on change collection item property');
    }, 1000);
    library.addEventListener('change', () => {
        clearTimeout(timeout);
        resolve(library.serialize());
    });
    library.books[0].title = 'Bakemonogatari';
    /*/
    resolve(library.serialize());
    //*/
};
