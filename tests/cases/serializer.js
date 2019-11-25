const _ = require('../utils');
const { Author, Book, Library } = require('../models');
module.exports.models = [Library];

module.exports.title = 'Serializer tests';
module.exports.name = 'serializer-test';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const author = new Author();
    author.deserialize({ firstname: 'Ito', lastname: 'Ōgure', surname: 'Oh! Great', comment: 'N/A' });
    const book = new Book({ author, readable: false });

    if (!Author.memory.read(author.uuid)) throw new Error('Error on memory / serializer');
    _.test(author.firstname, 'Ito', 'Error on serializer accessor');

    if (!Book.memory.read(book.uuid)) throw new Error('Error on memory / serializer');
    _.test(book.readable, false, 'Error on serializer accessor');

    if (!book.serialize()) throw new Error('Error on serializer');

    resolve(author);
};
