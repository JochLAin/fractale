# Simple example

```javascript
'use strict';

const Fractale = require('fractale');

const Book = Fractale.create('Book', {
    title: String,
    author: String,
    editor: String
});
```