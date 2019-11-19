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

if (!instance.serialize()) {
    throw new Error('Error on inheritance serializer');
}

resolve(instance.serialize());
```

### Results

```json
{
    "uuid": "ac99b6ec-60f3-4893-b1f3-8438aec33711",
    "value": "Hello",
    "children": [
        {
            "uuid": "08401d24-c817-44d2-9d41-98465dd7c2b0",
            "value": "world"
        },
        {
            "uuid": "ef15e624-df53-4681-9d43-439976d39e7f",
            "value": "you"
        }
    ]
}
```