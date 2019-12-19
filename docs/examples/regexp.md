### Models

```javascript
const ModelWithRegExpAsKey = Fractale.create("ModelWithRegExpAsKey", {
    "/item_\\d+/i": String,
    // or
    [/item_\d+/i]: String,
});
```

### Run

```javascript
const { ModelWithRegExpAsKey } = module.exports.get();
const instance = new ModelWithRegExpAsKey({
    item_1: 'Foo',
    item_2: 'Bar',
});

_.test(instance.item_1, 'Foo', 'Error on regexp key accessor with type string');
_.test(instance.item_2, 'Bar', 'Error on regexp key accessor with type string');

resolve(instance);
```

### Results

```json
{
    "uuid": "ce8acbec-5c6b-43bf-bc63-1d0fa37d4198",
    "item_1": "Foo",
    "item_2": "Bar"
}
```
