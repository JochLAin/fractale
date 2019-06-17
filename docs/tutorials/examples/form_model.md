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
### Console
```
{
    "uuid": "c1d66a33-73e6-4b86-a5e1-1e24a33cd6cc",
    "author": {
        "uuid": "8e7ed9c1-5337-4a12-8f6c-f61880e2d81a",
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