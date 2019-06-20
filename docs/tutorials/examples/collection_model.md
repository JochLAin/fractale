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

### Results

```

{
    "uuid": "50779260-03d2-4815-b034-f7fe29ac6779",
    "books": [
        {
            "uuid": "c1b4c5c2-4d92-48e2-880c-7418b08600cd",
            "author": {
                "uuid": "d4d2f43e-f6cc-4e62-950f-1b8dea68dbb1",
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
            "uuid": "be9a1ef3-2c48-48a2-83fb-90c7a4a590be",
            "author": {
                "uuid": "d4d2f43e-f6cc-4e62-950f-1b8dea68dbb1",
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
            "uuid": "5f843c33-eaa6-4602-9429-0ebfc7defbbe",
            "author": {
                "uuid": "d4d2f43e-f6cc-4e62-950f-1b8dea68dbb1",
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