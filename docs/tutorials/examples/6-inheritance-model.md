<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```javascript
const Child = Fractale.create("Child", {
    value: String
});

const Parent = Fractale.create("Parent", Child, {
    children: [
        Child
    ]
});,const Child = Fractale.create("Child", {
    value: String
});
```

</div></article>

```javascript
const instance = new Parent({
    value: 'Hello',
    children: [
        { value: 'world' },
        { value: 'you' },
    ]
});

if (instance.sayHelloTo(0) !== 'Hello world') {
    throw new DetailedError('Error on parent method call', `Expected "Hello world" got "${instance.sayHelloTo(0)}"`);
}

if (instance.sayHelloTo(1) !== 'Hello you') {
    throw new DetailedError('Error on parent method call', `Expected "Hello you" got "${instance.sayHelloTo(1)}"`);
}

if (instance.toUpperCase() !== 'HELLO') {
    throw new DetailedError('Error on method inheritance', `Expected "HELLO" got "${instance.toUpperCase()}"`);
}

resolve(instance);
```

### Results

```json
{
    "uuid": "7150cd8f-0c20-46b4-bb8b-34cae02af51b",
    "value": "Hello",
    "children": [
        {
            "uuid": "389e52f0-16a1-414a-9f94-712e10c0caf5",
            "value": "world"
        },
        {
            "uuid": "f21d4a4a-9ef5-4fea-9873-c9436dcf4829",
            "value": "you"
        }
    ]
}
```