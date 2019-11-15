<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```

const Compound = Fractale.create("Compound", Simple, {
    boards: [
        String
    ],
    metadata: {
        key: String,
        data: {
            key: String,
            value: undefined
        }
    },
    collections: [
        {
            key: String,
            value: String
        }
    ]
});

```

</div></article>

```

const instance = new Compound({
    string: 'Hello world',
    boards: ['Lorem ipsum', 'Dolores sit amet'],
    metadata: { key: 'Foo', data: { key: 'Bar', value: 12 }}
});

if (instance.metadata.key !== 'Foo') {
    throw new DetailedError('Error on metadata accessor', `Expected "Foo" got "${instance.metadata.key}"`);
}

const metadata = instance.metadata;
metadata.key = 'decomposition';

if (instance.metadata.key !== 'decomposition') {
    throw new DetailedError('Error on metadata accessor with decomposition', `Expected "decomposition" got "${instance.metadata.key}"`);
}

instance.metadata.key = 'dot';
if (instance.metadata.key !== 'dot') {
    throw new DetailedError('Error on metadata accessor with dot', `Expected "dot" got "${instance.metadata.key}"`);
}

instance.metadata = { key: 'assign' };
if (instance.metadata.key !== 'assign') {
    throw new DetailedError('Error on metadata accessor with assign', `Expected "assign" got "${instance.metadata.key}"`);
}
if (instance.metadata.data.key !== 'Bar') {
    throw new DetailedError('Error on metadata accessor with assign', `Expected "Bar" got "${instance.metadata.data.key}"`);
}

instance.metadata = { data: { key: 'after' } };
if (instance.metadata.key !== 'assign') {
    throw new DetailedError('Error on metadata accessor with bracket', `Expected "assign" got "${instance.metadata.key}"`);
}
if (instance.metadata.data.key !== 'after') {
    throw new DetailedError('Error on metadata accessor with bracket', `Expected "after" got "${instance.metadata.data.key}"`);
}
if (instance.metadata.data.value !== 12) {
    throw new DetailedError('Error on metadata accessor with bracket', `Expected "12" got "${instance.metadata.data.value}"`);
}

if (!instance.serialize()) {
    throw new Error('Error on metadata serializer');
}

resolve(instance.serialize());

```

### Results

```

{
    "uuid": "39e943d5-29cf-40f5-b630-99521ab577f4",
    "string": "Hello world",
    "boards": [
        "Lorem ipsum",
        "Dolores sit amet"
    ],
    "metadata": {
        "uuid": "d8caed09-c2a2-4b02-beab-75424f1660d4",
        "key": "assign",
        "data": {
            "uuid": "dbb746b6-9bb8-45b0-b20f-3ec4a0b47d73",
            "key": "after",
            "value": 12
        }
    },
    "collections": []
}

```