Inspired from [Mongoose](https://mongoosejs.com/docs/guide.html), it allows you to modeling your data to be explicit on data format.

It will test value of each fields and link model between them.

# Installation

`npm install -S fractale`

# Documentation

You can found more documentation and examples [here](http://docs.faihy.org/fractale).

# Usage

## Declaration

```javascript
'use strict';

const Fractale = require('fractale');

const KeyValuePair = Fractale.create(
    'KeyValuePair', /* Name of your model (required) */
    { /* Model's schema */
        key: String,
        value: null || undefined,
    }
);

/* Complete example */
const Model = Fractale.create(
    'Model', 
    {
        mixed: null || undefined,
        boolean: Boolean,
        number: Number,
        string: String,
        boards: [String],
        metadata: { key: String },
        collections: [{ key: String, value: null }],
        inception: KeyValuePair,
        self: Fractale.SELF,
    }
);
```

## Instanciation

```javascript
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
    inception: { key: 'key', value: 1 }
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
    inception: { key: 'key', value: 1 }
}
*/
```

## Modification

```javascript
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

console.log(myModel.inception); // > KeyValuePair { key: 'key', value: 1 }
myModel.inception = new KeyValuePair({ key: 'new_key', value: 'new_value' });
console.log(myModel.inception); // > KeyValuePair { key: 'new_key', value: 'new_value' }

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
    ],
    inception: { key: 'new_key', value: 'new_value' }
}
*/
```

## Array helpers

```javascript
/* Singular use */
// Create new board
myModel.board = 'New value';
console.log(myModel.board(2)); // > 'New value'

// Create new item in collection
myModel.collection = { key: 'qwerty', value: 1 };
console.log(myModel.collection(2).key); // > 'qwerty'

/* Array methods use */
myModel.collections.push({ key: 'azertyuiop', value: 2 });
myModel.collections = myModel.collections.concat([{ key: 'new_key', value: 3 }, { key: 'N3W_K3Y', value: 4 }]);
console.log(myModel.serialize().collections);
/*
> [
    { key: 'pass', value: 789 },
    { key: 'bar', value: 456 },
    { key: 'qwerty', value: 1 },
    { key: 'new_key', value: 3 },
    { key: 'N3W_K3Y', value: 4 }
]
*/
```

# License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/JochLAin/fractale/blob/master/LICENSE) file for details

# Authors

* **Jocelyn Faihy** - *Web developer* - [Jochlain](https://github.com/JochLAin)

See also the list of [contributors](https://github.com/JochLAin/fractale/graphs/contributors) who participated in this project.

# Thanks

![Thanks BP](https://media1.giphy.com/media/yoJC2El7xJkYCadlWE/giphy.gif)