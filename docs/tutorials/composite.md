# Composite example

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
