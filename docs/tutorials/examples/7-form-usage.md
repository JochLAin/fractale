<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```javascript
const Form_Parent = Fractale.create("Form_Parent", {
    value: String
});

const Form_Child = Fractale.create("Form_Child", {
    parent: Form_Parent,
    value: String
});
```

</div></article>

```javascript
const { Form_Parent, Form_Child } = module.exports.get();
const parent = new Form_Parent({ value: 'foo' });
const child = new Form_Child({ parent: parent.uuid, value: 'bar' });

_.test(child.value, 'bar', 'Error on form setter');
_.test(child.parent.value, 'foo', 'Error on form setter');

resolve(child);
```

### Results

```json
{
    "uuid": "749e092a-213e-4757-840b-8b85aa77c13b",
    "parent": {
        "uuid": "baf6aade-8a83-466e-a0b1-45df59d0daaf",
        "value": "foo"
    },
    "value": "bar"
}
```