const { DetailedError } = require('../error');
const { Author, Book, Library } = require('../models');
module.exports.models = [Library];

module.exports.title = 'Serializer tests';
module.exports.name = 'serializer-test';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const author = new Author();
    author.deserialize({ firstname: 'Ito', lastname: 'Ōgure', surname: 'Oh! Great', comment: 'N/A' });
    const book = new Book({ author, readable: false });

    if (!Author.memory.read(author.uuid)) {
        throw new Error('Error on memory / serializer');
    }
    if (author.firstname !== 'Ito') {
        throw new DetailedError('Error on serializer accessor', `Expected "Ito" got "${author.firstname}"`);
    }

    if (!Book.memory.read(book.uuid)) {
        throw new Error('Error on memory / serializer');
    }
    if (book.readable !== false) {
        throw new DetailedError('Error on serializer accessor', `Expected "false" got "${book.readable}"`);
    }

    if (!book.serialize()) {
        throw new Error('Error on serializer');
    }

    resolve(author);
};
