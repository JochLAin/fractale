
const Fractale = require('../../factory');

module.exports.title = 'Test compound model';

module.exports.run = () => new Promise((resolve, reject) => {
    const Library = Fractale.create('Library', {
        books: [{
            readable: Boolean,
            title: String,
            nb_chapter: Number
        }]
    });

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
        return reject(new Error('Error on collection accessor with brace'));
    }
    if (library.book(1).title !== 'Tenjo tenge') {
        return reject(new Error('Error on collection accessor with function singular'));
    }

    if (!library.serialize()) {
        return reject(new Error('Error on collection serialize'));
    }
    resolve();
});
