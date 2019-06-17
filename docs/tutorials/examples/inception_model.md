<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">
```
const Author = Fractale.create("Author", {
    "firstname": String,
    "lastname": String,
    "surname": String,
    "comment": String
});

const Page = Fractale.create("Page", {
    "title": String,
    "content": String
});

const Chapter = Fractale.create("Chapter", {
    "pages": [
        Page
    ]
});

const Book = Fractale.create("Book", {
    "author": Author,
    "readable": Boolean,
    "title": String,
    "chapters": [
        Chapter
    ]
});
```
</div></article>
```
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
    throw new Error('Error on deep getter with dot');
}

const author = book.author;
author.comment = 'I love this author';
book.author = author;
if (book.author.comment !== 'I love this author') {
    throw new Error('Error on inception deep setter with dot');
}

book.author.comment = 'N/A';
if (book.author.comment !== 'N/A') {
    throw new Error('Error on deep setter with dot');
}

if (!book.serialize()) {
    throw new Error('Error on inception serializer');
}

resolve(book.serialize());
```
### Console
```
{
    "uuid": "771cca93-5de5-4e81-9624-6975ec73ddd4",
    "author": {
        "uuid": "83d78f78-4be9-454c-98d9-31b7de2f4cd0",
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