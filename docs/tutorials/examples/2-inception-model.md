<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```javascript
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

const Book = Fractale.create("Book", {
    author: Author,
    readable: Boolean,
    title: String,
    chapters: [
        Chapter
    ]
});
```

</div></article>

```javascript
const book = new Book({
    author: {
        firstname: 'Ito',
        lastname: 'Ōgure',
        surname: 'Oh! Great',
        comment: 'N/A',
    },
    title: 'Air gear',
    readable: true,
});
if (book.author.comment !== 'N/A') {
    throw new DetailedError('Error on inception setter with dot', `Expected "N/A" got "${book.author.comment}"`);
}

const author = book.author;
const value = 'I love this author';
author.comment = value;
if (book.author.comment !== value) {
    throw new DetailedError('Error on inception setter with dot', `Expected "${value}" got "${book.author.comment}"`);
}

book.author.comment = 'N/A';
if (book.author.comment !== 'N/A') {
    throw new Error('Error on deep setter with dot');
}

resolve(book);
```

### Results

```json
{
    "uuid": "ee127d61-882c-4e92-9df2-23a3204dad15",
    "author": {
        "uuid": "4fb70b5b-1c26-43d5-9abb-316c565a3498",
        "firstname": "Ito",
        "lastname": "Ōgure",
        "surname": "Oh! Great",
        "comment": "N/A"
    },
    "readable": true,
    "title": "Air gear",
    "chapters": []
}
```