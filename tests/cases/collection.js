
const { Library, Author } = require('./models');

module.exports.title = 'Test collection model';

module.exports.run = () => new Promise((resolve) => {
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
    if (library.book(1).title !== 'Tenjo tenge') {
        throw new Error('Error on collection accessor with function singular');
    }
    if (library.books[2].title !== 'Biorg trinity') {
        throw new Error('Error on array methods accessor');
    }

    if (!library.serialize()) {
        throw new Error('Error on collection serializer');
    }
    resolve();
});
