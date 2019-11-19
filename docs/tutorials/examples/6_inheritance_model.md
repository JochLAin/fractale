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
    "uuid": "40f90132-472e-4741-b861-cc31aa64250f",
    "value": "Hello",
    "children": [
        {
            "uuid": "f5969cf3-3e8b-4daf-87fa-22b6a50ab255",
            "value": "world"
        },
        {
            "uuid": "774f0b4a-9ef8-4a21-b75f-7527561d1557",
            "value": "you"
        }
    ]
}
```