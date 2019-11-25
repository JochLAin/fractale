const _ = require('../utils');
const { Author, Book } = require('../models');
module.exports.models = [Book];

module.exports.title = 'Form usage';
module.exports.name = 'form-usage';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const author = new Author({ firstname: 'Jocelyn', lastname: 'Faihy', surname: 'Jochlain', comment: 'Great' });
    const book = new Book({ author: author.uuid, title: 'Au-delà de la donnée', readable: false });

    _.test(book.author.firstname, 'Jocelyn', 'Error on form setter');

    resolve(book);
};
