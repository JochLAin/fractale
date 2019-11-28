<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```javascript
const Inception_Parent = Fractale.create("Inception_Parent", {
    value: String
});

const Inception_Child = Fractale.create("Inception_Child", {
    parent: Inception_Parent,
    value: String
});
```

</div></article>

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
    "uuid": "335760a2-e354-4d8b-a1bb-e69423b11eb3",
    "parent": {
        "uuid": "13801def-ecfb-42d0-8299-78f30fafba67",
        "value": "foo"
    },
    "value": "bar"
}
```