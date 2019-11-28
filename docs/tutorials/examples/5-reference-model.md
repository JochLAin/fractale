<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```javascript
const Self = Fractale.create("Self", {
    self: Self,
    value: String
});
```

</div></article>

```javascript
const { Self } = module.exports.get();
const instance_1 = new Self({ value: 'foo' });
const instance_2 = new Self({ self: { self: instance_1, value: 'bar' }, value: 'hello' });

_.test(instance_1.value, 'foo', 'Error on deep accessor variable name');
_.test(instance_2.self.value, 'bar', 'Error on self-reference accessor');
_.test(instance_2.self.self.value, 'foo', 'Error on double self-reference accessor');
_.test(instance_2.self.self.self, undefined, 'Error infinite self-reference accessor');

resolve(instance_2);
```

### Results

```json
{
    "uuid": "621609f2-c287-4de0-b3ab-f11004184253",
    "self": {
        "uuid": "c388b07d-0716-43bb-be7e-84c65a60a399",
        "self": {
            "uuid": "e845e9aa-8fe5-4745-944f-cf635b7a28a0",
            "value": "foo"
        },
        "value": "bar"
    },
    "value": "hello"
}
```