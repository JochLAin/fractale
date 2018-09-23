# Fractale-js

Data Modeling

Inspired from Mongoose, it allows you to modeling your data to be explicit on data format.
It will test value of each fields and link model between them.

## Usage

```javascript
'use strict';

const Fractale = require('fractale-js');

const myModel = Fractale.create('Foo' /* Name of your model (required) */, {
    boolean: Boolean, //
    number: Number, //
    string: String, //
    arrayOfString: [String], //
    objectWithString: { key: String },
    arrayOfObjectWithString: [{ key: String }]
});
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
});

const Chapter = Fractale.create('Chapter', {
    pages: [String],
});

const Book = Fractale.create('Book', {
    title: String,
    description: String,
    summary: String,
    author: Author,
    editor: String,
    score: Number,
    chapters: [Chapter],
    comments: [{
        author: String,
        text: String
    }],
});
```