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
        text: String
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
    description: `Dans un futur proche, les évolutions technologiques ont permis de créer des rollers contenant un moteur surpuissant, appelés AT (Air Trecks), avec lesquels il est possible d'effectuer des figures et des sauts défiant quasiment les lois de la gravité. Les amateurs de ce sport se rassemblent en groupes (gangs). Itsuki « Ikki » Minami est un collégien plutôt bagarreur vivant chez quatre filles qu'il considère comme ses sœurs qui l'ont recueilli alors qu'il était encore très jeune. L'une d'entre elles, Ringo, est secrètement amoureuse de lui. Ikki est le leader des "Higashi Guns" (ou Higachû) et se fait appeler "Babyface" par ses amis. Selon eux, il n'aurait aucun adversaire à sa taille au combat de rue. Il se bat un jour avec un gang de Storm Riders mais se fait battre à plate couture. Pour se venger, il décide de voler une paire de AT à l'une de ses sœurs. Depuis quelque temps, Ikki est intrigué par ces rollers, en partie à cause d'une fille qu'il vient voir s'entraîner et dont il est tombé amoureux. Il décide finalement de combattre ce gang, les Skull Saders, avec l'aide de ses sœurs qui forment en fait un gang appelé les "Sleeping Forest". Après ce combat, il se découvrira d'étonnantes capacités pour ces Air Trecks et finira finalement par former son propre gang de riders.`
    score: 4.9,
    comments: [{ author: 'Anon.', text: 'Vraiment sublime' }],
});

book.score = 5;
console.log(book.serialize());
```
