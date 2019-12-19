### Models

```javascript
const Inception_Parent = Fractale.create("Inception_Parent", {
    value: String
});

const Inception_Child = Fractale.create("Inception_Child", {
    parent: Inception_Parent,
    value: String
});
```

### Run

```javascript
const { Inception_Child } = module.exports.get();
const child = new Inception_Child({
    parent: { value: 'foo' },
    value: 'bar',
});

_.test(child.parent.value, 'foo', 'Error on inception setter with dot');

const parent = child.parent;
const value = 'hello world';
parent.value = value;
_.test(child.parent.value, value, 'Error on inception setter with dot');

child.parent.value = 'foo';
_.test(child.parent.value, 'foo', 'Error on deep setter with dot');

resolve(child);
```

### Results

```json
{
    "uuid": "0df3caf3-0df8-40b5-8fc2-53edeb5904b5",
    "parent": {
        "uuid": "74d8dd1b-d063-4240-91c0-f61473377ba2",
        "value": "foo"
    },
    "value": "bar"
}
```