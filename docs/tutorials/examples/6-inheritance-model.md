<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

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

</div></article>

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
    "uuid": "df66825d-8143-4de6-875f-63a3b5806351",
    "value": "Hello",
    "children": [
        {
            "uuid": "ad7cd319-cc67-4810-b94f-65e264f9610e",
            "value": "world"
        },
        {
            "uuid": "8aeefc0e-9436-4946-a24b-cf3ebb473421",
            "value": "you"
        }
    ]
}
```