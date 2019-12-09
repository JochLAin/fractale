const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'Static method test';
module.exports.name = 'static';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const { Book } = module.exports.get();
    const book = new Book({ title: 'Air gear', readable: true });
    const clone = Book.from(book);
    clone.readable = false;

    _.test(book.title, 'Air gear', 'Error on static method from');
    _.test(clone.title, 'Air gear', 'Error on static method from');
    _.test(book.readable, true, 'Error on static method from');
    _.test(clone.readable, false, 'Error on static method from');

    resolve(clone);
};

module.exports.create = () => {
    const Book = Fractale.create('Static_Book', {
        readable: Boolean,
        title: String,
    });

    return { Book };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};
