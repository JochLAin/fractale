
const Fractale = require('../../factory');

module.exports.title = 'Test simple model';

module.exports.run = () => new Promise((resolve, reject) => {
    const Book = Fractale.create('Book', {
        readable: Boolean,
        title: String,
        nb_chapter: Number
    });

    const book = new Book({
        title: 'Air gear',
        readable: true,
        nb_chapter: 31
    });

    if (book.title !== 'Air gear') {
        return reject(new Error('Error on simple accessor'));
    }

    if (!book.serialize()) {
        return reject(new Error('Error on simple serialize'));
    }

    resolve();
});
