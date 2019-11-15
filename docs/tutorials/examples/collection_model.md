<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```

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

```

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

```

{
    "uuid": "8aa7abed-9a3b-4ec6-a1b8-e5c04a98ca8f",
    "books": [
        {
            "__events": {
                "change": {
                    "listeners": [
                        null,
                        null
                    ]
                }
            },
            "_uuid": "988948c9-a590-4bcb-b963-5cfbdefce5cd",
            "_props": {
                "_author": "f15c042a-f81b-4194-b8dd-80fccb76c456",
                "_title": "Tenjo tenge",
                "_chapters": []
            }
        },
        {
            "__events": {
                "change": {
                    "listeners": [
                        null,
                        null
                    ]
                }
            },
            "_uuid": "42e77493-dce7-40c1-888f-50a211ff691f",
            "_props": {
                "_author": "f15c042a-f81b-4194-b8dd-80fccb76c456",
                "_title": "Biorg trinity",
                "_chapters": []
            }
        }
    ]
}

```