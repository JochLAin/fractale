### Models

```javascript
const Form_Parent = Fractale.create("Form_Parent", {
    value: String
});

const Form_Child = Fractale.create("Form_Child", {
    parent: Form_Parent,
    value: String
});
```

### Run

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
    "uuid": "1735999a-c604-4f27-9068-0fa2b5008167",
    "parent": {
        "uuid": "c18571fc-c256-4777-9075-684a511b12dd",
        "value": "foo"
    },
    "value": "bar"
}
```