# Complex example

```javascript
'use strict';

const Fractale = require('fractale');

const Author = Fractale.create('Author', {
    firstname: String,
    lastname: String,
    surname: String,
});

const Chapter = Fractale.create('Chapter', {
    pages: [String],
});

const Book = Fractale.create('Book', {
    title: String,
    author: Author,
    editor: String,
    description: String,
    summary: String,
    score: Number,
    chapters: [Chapter],
    comments: [{
        author: String,
        text: String,
    }],
});
```
