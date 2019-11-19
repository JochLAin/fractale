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

if (!book.serialize()) {
    throw new Error('Error on form serializer');
}

resolve(book.serialize());
```

### Results

```json
{
    "uuid": "ffbd39f7-bc68-4746-9fee-917b174b3b0a",
    "author": {
        "uuid": "4e33baad-4792-4862-b9fa-caad95492dab",
        "firstname": "Jocelyn",
        "lastname": "Faihy",
        "surname": "Jochlain",
        "comment": "Great"
    },
    "title": "Au-delà de la donnée",
    "chapters": []
}
```