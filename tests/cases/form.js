
const { Library, Author, Book, Chapter, Page } = require('./models');

module.exports.title = 'Test form model';

module.exports.run = () => new Promise((resolve) => {
    // const intro = new Page({
    //     title: 'Introduction',
    //     content: 'Lorem ipsum dolores sit amet',
    // });
    //
    // const chapter = new Chapter({
    //     pages: [intro.uuid],
    // });

    const author = new Author({
        firstname: 'Jocelyn',
        lastname: 'Faihy',
        surname: 'Jochlain',
        comment: 'Great',
    });

    const book = new Book({
        author: author.uuid,
        readable: false,
        title: 'Au-delà de la donnée',
        // chapters: [chapter],
    });

    if (!book.serialize()) {
        throw new Error('Error on collection serializer');
    }
    resolve();
});
