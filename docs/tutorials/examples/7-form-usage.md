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
const author = new Author({
    firstname: 'Jocelyn',
    lastname: 'Faihy',
    surname: 'Jochlain',
    comment: 'Great',
});

const book = new Book({
    author: author.uuid,
    title: 'Au-delà de la donnée',
    readable: false,
});

if (book.author.firstname !== 'Jocelyn') {
    throw new DetailedError('Error on form setter', `Expected "Jocelyn" got "${book.author.firstname}"`);
}

resolve(book);
```

### Results

```json
{
    "uuid": "bad91564-bb5f-4b74-b6bf-be6533148f99",
    "author": {
        "uuid": "e014b8a5-36d7-42f1-ab55-f7300864ff0b",
        "firstname": "Jocelyn",
        "lastname": "Faihy",
        "surname": "Jochlain",
        "comment": "Great"
    },
    "readable": false,
    "title": "Au-delà de la donnée",
    "chapters": []
}
```