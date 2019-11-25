const _ = require('../utils');
const { Book } = require('../models');
module.exports.models = [Book];

module.exports.title = 'Static method test';
module.exports.name = 'static-test';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const book = new Book({ author: { firstname: 'Ito', lastname: 'Ōgure', surname: 'Oh! Great', comment: 'N/A' }, title: 'Air gear', readable: true });
    const clone = Book.from(book);
    clone.readable = false;

    _.test(book.title, 'Air gear', 'Error on static method from');
    _.test(clone.title, 'Air gear', 'Error on static method from');
    _.test(book.readable, true, 'Error on static method from');
    _.test(clone.readable, false, 'Error on static method from');

    resolve(clone);
};
