
const { Library } = require('./models');

module.exports.title = 'Test collection model';

module.exports.run = () => new Promise((resolve) => {
    const library = new Library({
        books: [{
            title: 'Air gear',
            readable: true,
            nb_chapter: 31
        }, {
            title: 'Tenjo tenge',
            readable: true,
            nb_chapter: 21
        }]
    });

    if (library.books[0].title !== 'Air gear') {
        throw new Error('Error on collection accessor with brace');
    }
    if (library.book(1).title !== 'Tenjo tenge') {
        throw new Error('Error on collection accessor with function singular');
    }

    if (!library.serialize()) {
        throw new Error('Error on collection serialize');
    }
    resolve();
});
