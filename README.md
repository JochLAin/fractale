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
    start: Fractale.with(Date, { required: true, default: '2000-01-01' }),
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

console.log(instance.serialize());
/* 
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
}
*/

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

console.log(instance.serialize());
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
    inception: { key: 'new_key', value: 'updated_value' }
}
*/
```

### Array helpers

```javascript
/* Array methods use */
instance.collections.push({ key: 'azertyuiop', value: 2 });
instance.collections = instance.collections.concat([{ key: 'new_key', value: 3 }, { key: 'N3W_K3Y', value: 4 }]);
console.log(instance.serialize().collections);
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

### Options

#### Global options

```javascript
'use strict';

const Fractale = require('fractale');

Fractale.setOptions({
    use_moment: () => { try { require('moment'); return true; } catch (error) { return false; }}, // Specify to fractale to transform date to moment instance
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

## Plugins

Fractale add other custom types which need other optional modules

### Color

_Need `npm i -S teinte`_
```javascript
const Colored = Fractale.create('Colored', {
    color: Fractale.Color
});

const colored = new Colored({ color: '#0f0f0f' });
console.log(colored.hsl());
```

### Moment

> If moment module is installed Date will be automatically transform to moment instance

_Need `npm i -S moment`_
```javascript
const Article = Fractale.create('Article', {
    content: String,
    created_at: Date,
    updated_at: Date,
});

const article = new Article({
    content: 'This module is awesome',
    created_at: '2000-01-01',
    updated_at: '2000-01-01',
});
console.log(article.created_at.format('DD/MM/YYYY'));
```

## Providers

Fractale lets you possibility to save and retrieve values in a storage

```javascript
// To use Web localStorage
Fractale.memory.setProvider('local');

// To use Web sessionStorage
Fractale.memory.setProvider('session');

// To use Web cookie
Fractale.memory.setProvider('cookie', { expires: 6048e5 });

// To use Web IndexedDB
Fractale.memory.setProvider('idb', { database: 'ƒ_database' });
```

## Bridge

> /!\ Experimental

Fractale lets you possibility to transform models to other types

### Transform to Mongoose Model

_Need `npm i -S mongoose`_
```javascript
const model = Model.toMongoose();
```

### Transform to PropTypes

_Need `npm i -S prop-types`_
```javascript
const propTypes = Model.toPropTypes();
```

## Performance

From a JSON of 10.45M:
- Deserialization: ~0.895s => 11.68Mo/s
- Read: ~0.001s
- Serialization: ~0.304s => 34.37Mo/s

From a JSON of 339.06M:
- Deserialization: ~3.301s => 102.71Mo/s
- Read: ~0.001s
- Serialization: ~1.173s => 289.05Mo/s

From a JSON of 1.27G:
- Deserialization: ~12.942s => 98.22Mo/s
- Read: ~0s
- Serialization: ~6.089s => 208.77Mo/s

![Graph - Complexity x Rate](http://docs.faihy.org/fractale/images/graph_complexity_x_rate.png)
![Graph - Size x Rate](http://docs.faihy.org/fractale/images/graph_size_x_rate.png)

## Dependencies

- Usage of [uuid](https://www.npmjs.com/package/uuid) to generate a unique id for model instances.

Optional :
- Usage of [moment](https://momentjs.com/docs/) for date.
- Usage of [teinte](https://www.npmjs.com/package/teinte) for color.
- Usage of [mongoose](https://mongoosejs.com) for bridge / provider.
- Usage of [prop-types](https://www.npmjs.com/package/prop-types) for bridge.

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
