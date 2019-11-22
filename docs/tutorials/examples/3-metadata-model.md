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
    throw new DetailedError('Error on metadata accessor with assign', `Expected "Compound_Metadata_Data" got "${instance.metadata.data}"`);
}
if (instance.metadata.data.key !== 'Bar') {
    throw new DetailedError('Error on metadata accessor with assign', `Expected "Bar" got "${instance.metadata.data.key}"`);
}

instance.metadata = { data: { key: 'after', value: 13 } };
if (instance.metadata.key !== 'assign') {
    throw new DetailedError('Error on metadata accessor with bracket', `Expected "assign" got "${instance.metadata.key}"`);
}
if (instance.metadata.data.key !== 'after') {
    throw new DetailedError('Error on metadata accessor with bracket', `Expected "after" got "${instance.metadata.data.key}"`);
}
if (instance.metadata.data.value !== 13) {
    throw new DetailedError('Error on metadata accessor with bracket', `Expected "13" got "${instance.metadata.data.value}"`);
}

resolve(instance);
```

### Results

```json
{
    "uuid": "27f7e52b-18db-4381-9377-aafeca11875f",
    "string": "Hello world",
    "boards": [
        "Lorem ipsum",
        "Dolores sit amet"
    ],
    "metadata": {
        "uuid": "8ebc49b8-e82b-4215-bea3-4177c60b9b7e",
        "key": "assign",
        "data": {
            "uuid": "fb7c4a13-c5cf-4985-950c-ee919dd536f3",
            "key": "after",
            "value": 13
        }
    },
    "collections": []
}
```