# Fractale

Data Modeling

Inspired from [Mongoose](https://mongoosejs.com/docs/guide.html), it allows you to modeling your data to be explicit on data format.

It will test value of each fields and link model between them.

## Usage

```javascript
'use strict';

const Fractale = require('fractale');

const Model = Fractale.create(
    'Model', /* Name of your model (required) */
    { /* Model's schema */
        boolean: Boolean,
        number: Number,
        string: String,
        boards: [String],
        metadata: { key: String },
        collections: [{ key: String }]
    }
);
```

### Simple example

```javascript
'use strict';

const Fractale = require('fractale');

const Book = Fractale.create('Book', {
    title: String,
    author: String,
    editor: String
});
```

### Composite example

```javascript
'use strict';

const Fractale = require('fractale');

const Author = Fractale.create('Author', {
    firstname: String,
    lastname: String,
});

const Editor = Fractale.create('Editor', {
    firstname: String,
    lastname: String,
});

const Book = Fractale.create('Book', {
    title: String,
    author: Author,
    editor: Editor
});
```

### Complex example

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

### Instance example

```javascript

const { Book } = require('./models');

const book = new Book({
    title: 'Air gear',
    author: { firstname: 'Ōgure', lastname: 'Ito', surname: 'Oh! Great' },
    editor: 'Pika Edition',
    description: `...`,
    score: 4.9,
    comments: [{ author: 'Anon.', text: 'Vraiment sublime' }],
});

book.score = 5;

console.log(book.title);
console.log(book.author.surname);
console.log(book.serialize());
```