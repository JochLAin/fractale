<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">
```
const Compound = Fractale.create("Compound", {
    "boards": [
        String
    ],
    "metadata": {
        "key": String,
        "data": {
            "key": String,
            "value": mixed
        }
    },
    "collections": [
        {
            "key": String,
            "value": String
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

const metadata = instance.metadata;
metadata.key = 'decomposition';

if (instance.metadata.key !== 'decomposition') {
    throw new Error('Error on metadata accessor with decomposition');
}

instance.metadata.key = 'dot';
if (instance.metadata.key !== 'dot') {
    throw new Error('Error on metadata accessor with dot');
}

instance.metadata = { key: 'assign' };
if (instance.metadata.key !== 'assign') {
    throw new Error('Error on metadata accessor with assign');
}

instance.metadata = { data: { key: 'after', value: 'after' } };
if (instance.metadata.key !== 'assign' || instance.metadata.data.key !== 'after') {
    throw new Error('Error on metadata accessor with bracket');
}

if (!instance.serialize()) {
    throw new Error('Error on metadata serializer');
}

resolve(instance.serialize());
```
### Console
```
{
    "uuid": "c00d64f4-bde2-422f-a8b1-960ecce59eaf",
    "boards": [
        "Lorem ipsum",
        "Dolores sit amet"
    ],
    "metadata": {
        "uuid": "56fdc666-5871-43dc-a932-05c634481a33",
        "key": "assign",
        "data": {
            "uuid": "fc7791f4-5fcb-46eb-80bb-1c7305ac2c3f",
            "key": "after",
            "value": "after"
        }
    },
    "collections": []
}
```