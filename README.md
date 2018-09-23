# Fractale-js

Data Modeling

Inspired from [Mongoose](https://mongoosejs.com/docs/guide.html), it allows you to modeling your data to be explicit on data format.
It will test value of each fields and link model between them.

## Usage

```javascript
'use strict';

const Fractale = require('fractale-js');

const myModel = Fractale.create(
    'Foo', /* Name of your model (required) */
    { /* Model's schema */
        boolean: Boolean,
        number: Number,
        string: String,
        arrayOfString: [String],
        objectWithString: { key: String },
        arrayOfObjectWithString: [{ key: String }]
    }
);
```

### Simple example

```javascript
'use strict';

const Fractale = require('fractale-js');

const Book = Fractale.create('Book', {
    title: String,
    author: String,
    editor: String
});
```

### Composite example

```javascript
'use strict';

const Fractale = require('fractale-js');

const Author = Fractale.create('Author', {
    firstname: String,
    lastname: String,
});

const Book = Fractale.create('Book', {
    title: String,
    author: Author,
    editor: String
});
```

### Complex example

```javascript
'use strict';

const Fractale = require('fractale-js');

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
console.log(book.serialize());
```

### Library example

```javascript

const library = require('fractale-js/library');

const save = () => {
    const data = library.all();
    return JSON.stringify(data);
}

const open = (data) => {
    library.read(JSON.parse(data));    
}
```