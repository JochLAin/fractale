<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```

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
    throw new DetailedError('Error on form setter', `Expected "Jocelyn" got "${book.author.firstname}"`);
}

if (!book.serialize()) {
    throw new Error('Error on form serializer');
}

resolve(book.serialize());

```

### Results

```

{
    "uuid": "3e10a1e5-4c56-40c2-9a93-0b7c1ebb6b62",
    "author": {
        "uuid": "3d0fd015-c40b-44aa-8b83-e4dc4c3b5e86",
        "firstname": "Jocelyn",
        "lastname": "Faihy",
        "surname": "Jochlain",
        "comment": "Great"
    },
    "title": "Au-delà de la donnée",
    "chapters": []
}

```