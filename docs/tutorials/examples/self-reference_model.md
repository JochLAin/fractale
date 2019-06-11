<article class="mb-4">
<a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a>
<div id="models" class="border border-1 collapse">

```
const Variable = Fractale.create("Variable", {
    "name": String,
    "value": mixed,
    "static": Boolean,
    "scope": {
        "__type": String,
        "__options": {
            "values": [
                "private",
                "protected",
                "public"
            ]
        }
    }
});

const Method = Fractale.create("Method", {
    "signature": {
        "name": String,
        "properties": [
            Variable
        ]
    },
    "body": String
});

const Class = Fractale.create("Class", {
    "name": String,
    "inheritance": Fractale.SELF,
    "variables": Variable,
    "methods": [
        Method
    ]
});
```

</div>
</article>

```
const a = new Class({
    name: 'A',
    variables: [
        {name: 'a', value: 0},
    ],
    methods: [
        {signature: {name: 'getA'}},
        {signature: {name: 'setA', properties: [{name: 'a'}]}}
    ]
});

const b = new Class({
    name: 'B',
    inheritance: a,
    variables: [
        {name: 'b', value: 0},
    ],
    methods: [
        {signature: {name: 'getB'}},
        {signature: {name: 'setB', properties: [{name: 'b'}]}}
    ]
});

const c = new Class({
    name: 'C',
    inheritance: b,
    variables: [
        {name: 'c', value: 0},
    ],
    methods: [
        {signature: {name: 'getC'}},
        {signature: {name: 'setC', properties: [{name: 'c'}]}}
    ]
});

if (c.inheritance.name !== 'B') {
    throw new Error('Error on self-reference accessor');
}
if (c.inheritance.inheritance.name !== 'A') {
    throw new Error('Error on double self-reference accessor');
}
if (c.inheritance.inheritance.inheritance) {
    throw new Error('Error infinite self-reference accessor');
}

if (!c.serialize()) {
    throw new Error('Error on self-reference serialize');
}

resolve();
```