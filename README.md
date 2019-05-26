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

const myModel = new Model({
    boolean: true,
    number: 42,
    string: 'Hello world',
    boards: ['Lorem ipsum', 'dolores sit amet'],
    metadata: { key: 'AZERTYUIOP' },
    collections: [{ key: 'foo' }, { key: 'bar' }],
});

console.log(myModel.serialize());
```
