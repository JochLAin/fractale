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

/* More complete example */
const Model = Fractale.create(
    'Model', 
    {
        mixed: null || undefined,
        boolean: Boolean,
        number: Number,
        string: String,
        date: Date,
        boards: [String],
        metadata: { key: String },
        collection: [{ key: String, value: null }],
        inception: KeyValuePair,
        self: Fractale.SELF, // the Model itself
    }
);

/* Full example */
const Full = Fractale.create(
    'Full',
    Model, // Full inherit Model
    {
        declareAfter: Fractale.from('After'),
        withOption: Fractale.with(String, { validator: { in: ['Foo','Bar'] } }),
    }
);

const After = Fractale.create('After', {
    start: Date,
    end: Date,
});
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

console.log(myModel.serialize()); /* 
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
} */

/* Copy props to another instance */
// Method 1
const myFull = Full.from(myModel);

// Method 2
const serialized = myModel.serialize();
delete serialized.uuid;
const myFullClone = new Full(serialized);
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

console.log(myModel.serialize()); /* 
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
} */
```

## Array helpers

```javascript
/* Array methods use */
myModel.collections.push({ key: 'azertyuiop', value: 2 });
myModel.collections = myModel.collections.concat([{ key: 'new_key', value: 3 }, { key: 'N3W_K3Y', value: 4 }]);
console.log(myModel.serialize().collections); /*
> [
    { key: 'pass', value: 789 },
    { key: 'bar', value: 456 },
    { key: 'qwerty', value: 1 },
    { key: 'new_key', value: 3 },
    { key: 'N3W_K3Y', value: 4 }
] */
```

## Options

### Global options

```javascript
'use strict';

const Fractale = require('fractale');

Fractale.setOptions({
    moment: true, // Specify to fractale to transform date to moment instance. Default: false
});
```

### Field options

```javascript
'use strict';

const Fractale = require('fractale');

const Child = Fractale.create('Child', {
    mixed: undefined,
    boolean: Boolean,
    number: Number,
    string: String,
});

const Parent = Fractale.create('Parent', Child, {
    parent: Fractale.with(Fractale.SELF, {
        // Pass number of parent to number of great-parent
        through: ['number'],
    }),
    children: [
        Fractale.with(Child, {
            // Pass number of parent to mixed of child
            // Pass string of parent to string of child
            through: { number: 'mixed', string: 'string' },
        })      
    ],
});
```

### Field validators

```javascript
'use strict';

const Fractale = require('fractale');

const Simple = Fractale.create('Simple', {
    anyway: Fractale.with(undefined, {
        validator: (value) => value !== 'Yolo'
    }),
    mixed: Fractale.with(undefined, {
        validator: {
            in: ['foo', 'bar', 42]
        }
    }),
    numeric: Fractale.with(Number || Date, {
        validator: {
            gt: 17,
            gte: 18,
            lt: 51,
            lte: 50,
            between: [18, 50]
        }
    }),
    string: Fractale.with(String, {
        validator: {
            like: /bar$/
        }
    }),
});
```

# Dependencies

- Usage of [uuid](https://www.npmjs.com/package/uuid) to generate a unique id for model instances.
- Usage of [moment.js](https://momentjs.com/docs/) for date validation.

# License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/JochLAin/fractale/blob/master/LICENSE) file for details

# Authors

* **Jocelyn Faihy** - *Web developer* - [Jochlain](https://github.com/JochLAin)

See also the list of [contributors](https://github.com/JochLAin/fractale/graphs/contributors) who participated in this project.

# Thanks

![Thanks BP](https://media1.giphy.com/media/yoJC2El7xJkYCadlWE/giphy.gif)
