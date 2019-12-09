const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'Serializer tests';
module.exports.name = 'serializer';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const { Author, Book } = module.exports.get();
    const author = new Author();
    author.deserialize({ firstname: 'Ito', lastname: 'Ōgure', surname: 'Oh! Great', comment: 'N/A' });
    const book = new Book({ author, title: 'Air gear', readable: false });

    if (!Author.memory.read(author.uuid)) throw new Error('Error on memory / serializer');
    _.test(author.firstname, 'Ito', 'Error on serializer accessor');

    if (!Book.memory.read(book.uuid)) throw new Error('Error on memory / serializer');
    _.test(book.readable, false, 'Error on serializer accessor');

    const serialized = book.serialize();
    if (!serialized) throw new Error('Error on serializer');
    _.test(serialized.author.firstname, 'Ito', 'Error on deep serializer');

    resolve(author);
};

module.exports.create = () => {
    const Author = Fractale.create('Serializer_Author', {
        firstname: String,
        lastname: String,
        surname: String,
        comment: String,
    });

    const Book = Fractale.create('Serializer_Book', {
        author: Author,
        readable: Boolean,
        title: String,
    });

    return { Author, Book }
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};
