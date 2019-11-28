<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

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

</div></article>

```javascript
const { Metadata } = module.exports.get();
const instance = new Metadata({
    metadata: { key: 'Foo', data: { key: 'Bar', value: 12 }}
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
    "uuid": "f760592a-fbfa-4051-8b66-0f8409a3d4a0",
    "metadata": {
        "uuid": "8bf7a9c9-9644-459f-abcd-cad4f235ba5a",
        "key": "assign",
        "data": {
            "uuid": "f50eb191-031f-46eb-a315-7a4a16642d6d",
            "key": "after",
            "value": 13
        }
    }
}
```