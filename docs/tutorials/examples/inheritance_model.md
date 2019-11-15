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
    "uuid": "4b47fdf0-cd95-4cb7-a03d-3079b4a1bc07",
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
            "_uuid": "580fff0c-ccbc-45b1-b48e-b0104230605b",
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
            "_uuid": "54d54f0e-e35e-46df-8a11-7149cb7cef21",
            "_props": {
                "_value": "you"
            }
        }
    ]
}

```