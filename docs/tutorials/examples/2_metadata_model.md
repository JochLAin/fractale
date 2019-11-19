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
if (!instance.metadata.data) {
    throw new DetailedError('Error on metadata accessor with assign', `Expected "<uuid>" got "${instance.metadata.data}"`);
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
    "uuid": "c52b3e23-124e-48ba-bb92-e94e1336c83c",
    "string": "Hello world",
    "boards": [
        "Lorem ipsum",
        "Dolores sit amet"
    ],
    "metadata": {
        "uuid": "9c29ef6d-a835-47b4-ab88-f22e0e1bb390",
        "key": "assign",
        "data": {
            "uuid": "fa786ad2-9a33-4bef-b1a9-8bbc906543a3",
            "key": "after",
            "value": 12
        }
    },
    "collections": []
}
```