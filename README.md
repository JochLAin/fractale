Inspired from [Mongoose](https://mongoosejs.com/docs/guide.html), it allows you to modeling your data to be explicit on data format.

It will test value of each fields and link model between them.

## Installation

`npm install --save fractale`

## Documentation

You can found more documentation and examples [here](http://docs.faihy.org/fractale).

## Usage

### Declaration

```javascript
'use strict';

const Fractale = require('fractale');

const KeyValuePair = Fractale.create(
    'KeyValuePair', /* Name of your model (required) */
    { /* Model's schema */
        key: String,
        value: undefined,
    }
);

/* More complete example */
const Model = Fractale.create(
    'Model', 
    {
        mixed: undefined,
        boolean: Boolean,
        number: Number,
        string: String,
        date: Date,
        boards: [String],
        metadata: { key: String },
        inception: KeyValuePair,
        collection: [{ key: String, value: null }],
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

### Instanciation

```javascript
const instance = new Model({
    mixed: 'Great !',
    boolean: true,
    number: 42,
    string: 'Hello world',
    boards: ['Lorem ipsum', 'dolores sit amet'],
    metadata: { key: 'AZERTYUIOP' },
    inception: { key: 'key', value: 1 },
    collections: [
        { key: 'foo', value: 123 },
        { key: 'bar', value: 456 }
    ]
});

console.log(instance.serialize()); /* 
> { 
    mixed: 'Great !',
    boolean: true,
    number: 42,
    string: 'Hello world',
    boards: ['Lorem ipsum', 'dolores sit amet'],
    metadata: { key: 'AZERTYUIOP' },
    inception: { key: 'key', value: 1 },
    collections: [
        { key: 'foo', value: 123 },
        { key: 'bar', value: 456 }
    ]
} */

/* Copy props to another instance */
// Method 1
const full = Full.from(instance);

// Method 2
const serialized = instance.serialize();
delete serialized.uuid;
const clone = new Full(serialized);
```

### Modification

```javascript
console.log(instance.mixed); // > true
instance.mixed = 123;
console.log(instance.mixed); // > 123

console.log(instance.boolean); // > true
instance.boolean = false;
console.log(instance.boolean); // > false

console.log(instance.number); // > 42
instance.number = 12;
console.log(instance.number); // > 12

console.log(instance.string); // > 'Hello world'
instance.string = 'Lorem ipsum';
console.log(instance.string); // > 'Lorem ipsum'

console.log(instance.boards[0]); // > 'Lorem ipsum'
instance.boards[0] = 'Hello world';
console.log(instance.boards[0]); // > 'Hello World'

console.log(instance.metadata.key); // > 'AZERTYUIOP' 
instance.metadata.key = 'foo';
console.log(instance.metadata.key); // > 'foo' 

console.log(instance.inception); // > KeyValuePair { key: 'key', value: 1 }
instance.inception = new KeyValuePair({ key: 'new_key', value: 'new_value' });
console.log(instance.inception); // > KeyValuePair { key: 'new_key', value: 'new_value' }

console.log(instance.inception); // > KeyValuePair { key: 'new_key', value: 'new_value' }
instance.inception.value = 'updated_value';
console.log(instance.inception); // > KeyValuePair { key: 'new_key', value: 'updated_value' }

console.log(instance.collections[0].key); // > 'foo'
instance.collections[0].key = 'pass';
instance.collections[0] = { value: 789 };
console.log(instance.collections[0].key); // > 'pass'
console.log(instance.collections[0].value); // > 789

console.log(instance.serialize()); /* 
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
    inception: { key: 'new_key', value: 'updated_value' }
} */
```

### Array helpers

```javascript
/* Array methods use */
instance.collections.push({ key: 'azertyuiop', value: 2 });
instance.collections = instance.collections.concat([{ key: 'new_key', value: 3 }, { key: 'N3W_K3Y', value: 4 }]);
console.log(instance.serialize().collections); /*
> [
    { key: 'pass', value: 789 },
    { key: 'bar', value: 456 },
    { key: 'qwerty', value: 1 },
    { key: 'new_key', value: 3 },
    { key: 'N3W_K3Y', value: 4 }
] */
```

### Options

#### Global options

```javascript
'use strict';

const Fractale = require('fractale');

Fractale.setOptions({
    moment: true, // Specify to fractale to transform date to moment instance. Default: true
});
```

#### Field options

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

#### Field validators

```javascript
'use strict';

const Fractale = require('fractale');

const Simple = Fractale.create('Simple', {
    anyway: Fractale.with(undefined, {
        validator: (value) => value !== 'A value'
    }),
    mixed: Fractale.with(undefined, {
        validator: {
            in: ['foo', 'bar', 42]
        }
    }),
    number: Fractale.with(Number, {
        validator: {
            gt: 17,
            gte: 18,
            lt: 51,
            lte: 50,
            between: [18, 50]
        }
    }),
    date: Fractale.with(Date, {
        validator: {
            gt: '2019-11-17',
            gte: new Date('2019-11-18'),
            lte: moment('2019-11-20'),
            lt: moment(),
            between: [18] // If one value is between ... and today or today and ...
        }
    }),
    string: Fractale.with(String, {
        validator: {
            like: /bar$/
        }
    }),
});
```

## Performance

From a JSON of 10.45Mo (local storage limit):
- Deserialization: ~0.789s => 13.24Mo/s
- Read: ~0.001s
- Serialization: ~0.001s => 10.45Go/s

From a JSON of 339.06Mo:
- Deserialization: ~2.733s => 124.06Mo/s
- Read: ~0.001s
- Serialization: ~0.004s => 84.76Go/s

From a JSON of 1.27Go:
- Deserialization: ~10.657s => 119.28Mo/s
- Read: ~0.001s
- Serialization: ~0.004s => 317.8Go/s


![Graph - Complexity x Rate](http://docs.faihy.org/fractale/images/graph_complexity_x_rate.png)
![Graph - Size x Rate](http://docs.faihy.org/fractale/images/graph_size_x_rate.png)

## Dependencies

- Usage of [uuid](https://www.npmjs.com/package/uuid) to generate a unique id for model instances.
- Usage of [moment.js](https://momentjs.com/docs/) for date validation.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.

See the [contributing](https://github.com/JochLAin/fractale/blob/master/CONTRIBUTING.md) and [code of conduct](https://github.com/JochLAin/fractale/blob/master/CODE_OF_CONDUCT.md) files for details

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/JochLAin/fractale/blob/master/LICENSE) file for details

## Authors

* **Jocelyn Faihy** - *Web developer* and *Blob of Internets* - [Jochlain](https://github.com/JochLAin)

See also the list of [contributors](https://github.com/JochLAin/fractale/graphs/contributors) who participated in this project.

## Thanks

![Thanks BP](https://media1.giphy.com/media/yoJC2El7xJkYCadlWE/giphy.gif)
