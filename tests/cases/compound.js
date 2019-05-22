
const Model = require('../../factory');

module.exports.title = 'Test compound model'

module.exports.promise = new Promise((resolve, reject) => {
    const Library = Model.create('Library', {
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
        return reject(new Error('Error on compound accessor with brace'));
    }
    if (library.book(1).title !== 'Tenjo tenge') {
        return reject(new Error('Error on compound accessor with function singular'));
    }

    if (!library.serialize()) {
        return reject(new Error('Error on compound serialize'));
    }
    resolve();
});
