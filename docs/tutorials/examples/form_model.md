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

const author = new Author({
    firstname: 'Jocelyn',
    lastname: 'Faihy',
    surname: 'Jochlain',
    comment: 'Great',
});

const book = new Book({
    author: author.uuid,
    readable: false,
    title: 'Au-delà de la donnée'
});

if (book.author.firstname !== 'Jocelyn') {
    throw new Error('Error on form setter');
}
if (!book.serialize()) {
    throw new Error('Error on form serializer');
}

resolve(book.serialize());

```

### Results

```

{
    "uuid": "9daf5689-7d3a-4bb2-a40a-255408bdf79f",
    "author": {
        "uuid": "6312351b-1fb9-431a-a8c0-592d4a22df5f",
        "firstname": "Jocelyn",
        "lastname": "Faihy",
        "surname": "Jochlain",
        "comment": "Great"
    },
    "readable": null,
    "title": "Au-delà de la donnée",
    "chapters": []
}

```