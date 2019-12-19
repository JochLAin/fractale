### Models

```javascript
const Metadata = Fractale.create("Metadata", {
    metadata: {
        key: String,
        data: {
            key: String,
            value: undefined
        }
    }
});
```

### Run

```javascript
const { Metadata } = module.exports.get();
const instance = new Metadata({
    metadata: { key: 'Foo', data: { key: 'Bar', value: 12 } }
});

_.test(instance.metadata.key, 'Foo', 'Error on metadata accessor');

const metadata = instance.metadata;
metadata.key = 'decomposition';

_.test(instance.metadata.key, 'decomposition', 'Error on metadata accessor with decomposition');

instance.metadata.key = 'dot';
_.test(instance.metadata.key, 'dot', 'Error on metadata accessor with dot');

instance.metadata = { key: 'assign' };
_.test(instance.metadata.key, 'assign', 'Error on metadata accessor with assign');
_.test(instance.metadata.data.key, 'Bar', 'Error on metadata accessor with assign');

instance.metadata = { data: { key: 'after', value: 13 } };
_.test(instance.metadata.key, 'assign', 'Error on metadata accessor with bracket');
_.test(instance.metadata.data.key, 'after', 'Error on metadata accessor with bracket');
_.test(instance.metadata.data.value, 13, 'Error on metadata accessor with bracket');

resolve(instance);
```

### Results

```json
{
    "uuid": "afd52bc1-a356-42d0-8fa7-6776fcd891c5",
    "metadata": {
        "uuid": "6a80abee-f91c-4518-9199-4daa783dc4f7",
        "key": "assign",
        "data": {
            "uuid": "4eba5528-d517-482f-9dfa-df9d19dee313",
            "key": "after",
            "value": 13
        }
    }
}
```