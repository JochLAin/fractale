
const { Book } = require('./models');

module.exports.title = 'Test simple model';

module.exports.run = () => new Promise((resolve) => {
    const book = new Book({
        title: 'Air gear',
        readable: true,
        nb_chapter: 31
    });

    if (book.title !== 'Air gear') {
        throw new Error('Error on simple accessor');
    }

    if (!book.serialize()) {
        throw new Error('Error on simple serialize');
    }

    resolve();
});
