<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```

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

```

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

```

{
    "uuid": "24996afd-a230-487a-8624-4486c45539bd",
    "value": "Hello",
    "children": [
        {
            "__events": {
                "change": {
                    "listeners": [
                        null,
                        null
                    ]
                }
            },
            "_uuid": "3a50ecdd-59e2-4632-82fc-8ac96ebc1689",
            "_props": {
                "_value": "world"
            }
        },
        {
            "__events": {
                "change": {
                    "listeners": [
                        null,
                        null
                    ]
                }
            },
            "_uuid": "2a887e06-c8a1-4b7e-b1d8-621a92e1c829",
            "_props": {
                "_value": "you"
            }
        }
    ]
}

```