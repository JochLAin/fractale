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
    "uuid": "1c58fd3a-a671-453d-a4fb-26b47303faaf",
    "books": [
        {
            "uuid": "21431a86-3541-477b-aed9-653e24c76b59",
            "author": {
                "uuid": "1e5be136-1232-4e7c-85c6-25659f68dabd",
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
            "uuid": "072d13b9-ccd5-418b-b2cf-02c850833253",
            "author": {
                "uuid": "1e5be136-1232-4e7c-85c6-25659f68dabd",
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
            "uuid": "8f2a310e-871c-4bdf-bce5-f44dbcabb16b",
            "author": {
                "uuid": "1e5be136-1232-4e7c-85c6-25659f68dabd",
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