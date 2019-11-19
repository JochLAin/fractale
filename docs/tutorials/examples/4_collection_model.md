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
    "uuid": "a788276f-fcb4-403b-8319-e1fcde3aeaed",
    "books": [
        {
            "uuid": "0bcb1726-9bb4-4951-a558-f6f03c40ce85",
            "author": {
                "uuid": "4a7351ab-cf4c-4e29-b9bc-af1912bb0deb",
                "firstname": "Ito",
                "lastname": "Ōgure",
                "surname": "Oh! Great",
                "comment": "N/A"
            },
            "title": "Tenjo tenge",
            "chapters": []
        },
        {
            "uuid": "02b806c9-38c2-4783-96c4-84c45c853827",
            "author": {
                "uuid": "4a7351ab-cf4c-4e29-b9bc-af1912bb0deb",
                "firstname": "Ito",
                "lastname": "Ōgure",
                "surname": "Oh! Great",
                "comment": "N/A"
            },
            "title": "Biorg trinity",
            "chapters": []
        }
    ]
}
```