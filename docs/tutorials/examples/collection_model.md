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

const Library = Fractale.create("Library", {
    "books": [
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

const library = new Library({
    books: [{
        title: 'Air gear',
        readable: true,
        author: author,
    }, {
        title: 'Tenjo tenge',
        readable: true,
        author: author,
    }]
});

library.books.push({
    title: 'Biorg trinity',
    readable: true,
    author: author,
});

if (library.books[0].title !== 'Air gear') {
    throw new Error('Error on collection accessor with brace');
}
if (library.props.book(1).title !== 'Tenjo tenge') {
    throw new Error('Error on collection accessor with function singular');
}
if (library.books.last().title !== 'Biorg trinity') {
    throw new Error('Error on array methods accessor');
}

if (!library.serialize()) {
    throw new Error('Error on collection serializer');
}

resolve(library.serialize());
```
### Console
```
{
    "uuid": "bf6df605-b169-45ab-96bf-dc0299b30f04",
    "books": [
        {
            "uuid": "b0010385-a8b4-43f7-a67d-960154c46414",
            "author": {
                "uuid": "307ef81f-0a8a-4dc2-8121-86fc3a512fad",
                "firstname": "Ito",
                "lastname": "Ōgure",
                "surname": "Oh! Great",
                "comment": "N/A"
            },
            "readable": true,
            "title": "Air gear",
            "chapters": []
        },
        {
            "uuid": "2b7d3b33-7cbe-412f-aade-9c978170715f",
            "author": {
                "uuid": "307ef81f-0a8a-4dc2-8121-86fc3a512fad",
                "firstname": "Ito",
                "lastname": "Ōgure",
                "surname": "Oh! Great",
                "comment": "N/A"
            },
            "readable": true,
            "title": "Tenjo tenge",
            "chapters": []
        },
        {
            "uuid": "a12ce511-3fe0-40f8-b400-80ff2adb21a4",
            "author": {
                "uuid": "307ef81f-0a8a-4dc2-8121-86fc3a512fad",
                "firstname": "Ito",
                "lastname": "Ōgure",
                "surname": "Oh! Great",
                "comment": "N/A"
            },
            "readable": true,
            "title": "Biorg trinity",
            "chapters": []
        }
    ]
}
```