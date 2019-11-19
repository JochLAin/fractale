<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```javascript
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

```javascript
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

```json
{
    "uuid": "dd6c49c3-b176-4a51-986b-cc35ac15a7a0",
    "string": "Hello world",
    "boards": [
        "Lorem ipsum",
        "Dolores sit amet"
    ],
    "metadata": {
        "uuid": "e53d1514-90ce-4bce-af02-a6a0dc2ba4f7",
        "key": "assign",
        "data": {
            "uuid": "3c9ced74-44fd-4d5f-9fe5-26e5b40e7f0a",
            "key": "after",
            "value": 12
        }
    },
    "collections": []
}
```