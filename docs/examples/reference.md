### Models

```javascript
const Self = Fractale.create("Self", {
    self: Self,
    value: String
});
```

### Run

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
    "uuid": "508900d5-85ab-4903-865e-73fdbc2526f3",
    "self": {
        "uuid": "7a166e18-dfb5-46d8-8d44-cc54aa81ce4e",
        "self": {
            "uuid": "0e96dc9e-23e9-4cfd-abb8-89816ee11cfd",
            "value": "foo"
        },
        "value": "bar"
    },
    "value": "hello"
}
```