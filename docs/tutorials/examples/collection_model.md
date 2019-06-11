<article class="mb-4">
<a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a>
<div id="models" class="border border-1 collapse">

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

</div>
</article>

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
if (library.book(1).title !== 'Tenjo tenge') {
    throw new Error('Error on collection accessor with function singular');
}
if (library.books.last().title !== 'Biorg trinity') {
    throw new Error('Error on array methods accessor');
}

if (!library.serialize()) {
    throw new Error('Error on collection serializer');
}
resolve();
```