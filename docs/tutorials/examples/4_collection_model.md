<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```javascript
const Book = Fractale.create("Book", {
    author: Author,
    readable: Boolean,
    title: String,
    chapters: [
        Chapter
    ]
});

const Author = Fractale.create("Author", {
    firstname: String,
    lastname: String,
    surname: String,
    comment: String
});

const Chapter = Fractale.create("Chapter", {
    pages: [
        Page
    ]
});

const Page = Fractale.create("Page", {
    title: String,
    content: String
});

const Library = Fractale.create("Library", {
    books: [
        Book
    ]
});
```

</div></article>

```javascript
const author = new Author({
    firstname: 'Ito',
    lastname: 'Ōgure',
    surname: 'Oh! Great',
    comment: 'N/A',
});

const book = new Book({
    title: 'Air gear',
    readable: true,
    author: author,
});

const library = new Library({
    books: [book, {
        title: 'Tenjo tenge',
        readable: false,
        author: author,
    }]
});

if (library.books[0].title !== 'Air gear') {
    throw new DetailedError('Error on collection accessor with brace', `Expected "Air gear" got "${library.books[0].title}"`);
}
if (library.books[1].title !== 'Tenjo tenge') {
    throw new DetailedError('Error on collection accessor with brace', `Expected "Tenjo tenge" got "${library.books[1].title}"`);
}

let changed = false;
library.addEventListener('change', () => changed = true);
library.books[0].title = 'Bakemonogatari';

if (!changed) {
    throw new Error('Error on collection change event');
}
if (library.books[0].title !== 'Bakemonogatari') {
    throw new Error('Error on collection accessor with brace');
}
if (library.books.first.title !== 'Bakemonogatari') {
    throw new Error('Error on array method first accessor');
}

library.books.push({
    title: 'Biorg trinity',
    readable: false,
    author: author,
});

if (library.books.last.title !== 'Biorg trinity') {
    throw new Error('Error on array method last accessor');
}

if (library.books.map(book => book.title).join(', ') !== 'Bakemonogatari, Tenjo tenge, Biorg trinity') {
    throw new Error('Error on array method map accessor');
}

if (library.books.filter(book => book.readable).map(book => book.title).join(', ') !== 'Bakemonogatari') {
    throw new Error('Error on array method filter accessor');
}

if (library.books.reduce((accu, book) => `${accu} ${book.title}`, '').trim() !== 'Bakemonogatari Tenjo tenge Biorg trinity') {
    throw new Error('Error on array method reduce accessor');
}

library.books.remove(book);
if (library.books.length !== 2) {
    throw new Error('Error on array method remove accessor');
}

if (!library.serialize()) {
    throw new Error('Error on collection serializer');
}

resolve(library.serialize());
```

### Results

```json
{
    "uuid": "4c8c3c70-4837-4272-a6ce-e2b501a1d979",
    "books": [
        {
            "uuid": "19f490cc-8e37-42cc-a6a1-7f8c7c3b23ca",
            "author": {
                "uuid": "1d38e9a0-1a4e-47da-9a30-509cca144e76"
            },
            "title": "Tenjo tenge",
            "chapters": []
        },
        {
            "uuid": "5609f95f-df84-4be4-852b-76bb4d6a8290",
            "author": {
                "uuid": "4053e5b3-a043-459d-9e8e-3f9d98affc5d"
            },
            "title": "Biorg trinity",
            "chapters": []
        }
    ]
}
```