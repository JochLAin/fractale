### Models

```javascript
const Inheritance_Child = Fractale.create("Inheritance_Child", {
    value: String
});

const Inheritance_Parent = Fractale.create("Inheritance_Parent", Inheritance_Child, {
    children: [
        Inheritance_Child
    ]
});
```

### Run

```javascript
const { Inheritance_Parent } = module.exports.get();
const instance = new Inheritance_Parent({
    value: 'Hello',
    children: [
        { value: 'world' },
        { value: 'you' },
    ]
});

_.test(instance.sayHelloTo(0), 'Hello world', `Expected "Hello world" got "${instance.sayHelloTo(0)}"`);
_.test(instance.sayHelloTo(1), 'Hello you', 'Error on parent method call');
_.test(instance.toUpperCase(), 'HELLO', 'Error on method inheritance');

resolve(instance);
```

### Results

```json
{
    "uuid": "b0ac2336-9337-4267-a3ab-d4ff2cf2cb37",
    "value": "Hello",
    "children": [
        {
            "uuid": "d61de6e1-d69a-4562-a1e4-e473248f720d",
            "value": "world"
        },
        {
            "uuid": "262a4b5c-0124-48c0-8f64-9dcbff383a49",
            "value": "you"
        }
    ]
}
```