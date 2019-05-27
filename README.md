Inspired from [Mongoose](https://mongoosejs.com/docs/guide.html), it allows you to modeling your data to be explicit on data format.

It will test value of each fields and link model between them.

You can found documentation [here](http://docs.faihy.org/fractale).

## Usage

```javascript
'use strict';

const Fractale = require('fractale');

const Model = Fractale.create(
    'Model', /* Name of your model (required) */
    { /* Model's schema */
        mixed: null || undefined,
        boolean: Boolean,
        number: Number,
        string: String,
        boards: [String],
        metadata: { key: String },
        collections: [{ key: String, value: null }]
    }
);

const myModel = new Model({
    mixed: 'Great !',
    boolean: true,
    number: 42,
    string: 'Hello world',
    boards: ['Lorem ipsum', 'dolores sit amet'],
    metadata: { key: 'AZERTYUIOP' },
    collections: [
        { key: 'foo', value: 123 },
        { key: 'bar', value: 456 }
    ],
});

console.log(myModel.serialize());
/* 
> { 
    mixed: 'Great !',
    boolean: true,
    number: 42,
    string: 'Hello world',
    boards: ['Lorem ipsum', 'dolores sit amet'],
    metadata: { key: 'AZERTYUIOP' },
    collections: [
        { key: 'foo', value: 123 },
        { key: 'bar', value: 456 }
    ],
}
*/

console.log(myModel.mixed); // > true
myModel.mixed = 123;
console.log(myModel.mixed); // > 123

console.log(myModel.boolean); // > true
myModel.boolean = false;
console.log(myModel.boolean); // > false

console.log(myModel.number); // > 42
myModel.number = 12;
console.log(myModel.number); // > 12

console.log(myModel.string); // > 'Hello world'
myModel.string = 'Lorem ipsum';
console.log(myModel.string); // > 'Lorem ipsum'

console.log(myModel.boards[0]); // > 'Lorem ipsum'
myModel.boards[0] = 'Hello world';
console.log(myModel.boards[0]); // > 'Hello World'

console.log(myModel.metadata.key); // > 'AZERTYUIOP' 
myModel.metadata.key = 'foo';
console.log(myModel.metadata.key); // > 'foo' 

console.log(myModel.collections[0].key); // > 'foo'
myModel.collections[0].key = 'pass';
myModel.collections[0] = { value: 789 };
console.log(myModel.collections[0].key); // > 'pass'
console.log(myModel.collections[0].value); // > 789

console.log(myModel.serialize());
/* 
> { 
    mixed: 123,
    boolean: false,
    number: 12,
    string: 'Lorem ipsum',
    boards: ['Hello world', 'dolores sit amet'],
    metadata: { key: 'foo' },
    collections: [
        { key: 'pass', value: 789 },
        { key: 'bar', value: 456 }
    ]
}
*/

/* Singular use */
// Create new board
myModel.board = 'New value';
console.log(myModel.board(2)); // > 'New value'

// Create new item in collection
myModel.collection = { key: 'qwerty' };
console.log(myModel.collection(2).key); // > 'qwerty'
```

### Thanks

![Thanks BP](https://media1.giphy.com/media/yoJC2El7xJkYCadlWE/giphy.gif)