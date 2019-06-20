<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```

const Variable = Fractale.create("Variable", {
    "name": String,
    "value": mixed,
    "static": Boolean,
    "scope": {
        "$$__FractaleModel_TYPE_KEY": String,
        "$$__FractaleModel_OPTIONS_KEY": {
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

</div></article>

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

resolve(c.serialize());

```

### Results

```

{
    "uuid": "cf10a429-a79b-4318-90ab-00b0b9c08606",
    "name": "C",
    "inheritance": {
        "uuid": "b9db9ca4-9073-4905-9f6c-69abb569962e",
        "name": "B",
        "inheritance": {
            "uuid": "f8b9aec3-192b-4d3a-a4b8-398e29837432",
            "name": "A",
            "inheritance": null,
            "variables": {
                "uuid": "f7bc96ca-1b12-408b-89d4-39362a5e0319",
                "name": null,
                "static": null,
                "scope": null
            },
            "methods": [
                {
                    "uuid": "0acd46f8-ccc3-4bae-9f22-46d414033848",
                    "signature": {
                        "uuid": "fe3fae11-d06d-47c2-874c-49bcb73429fd",
                        "name": "getA",
                        "properties": []
                    },
                    "body": null
                },
                {
                    "uuid": "8265200a-6746-4e03-aa3f-58f09fe83678",
                    "signature": {
                        "uuid": "ec0914cb-f34e-4d8a-94a8-d523327689ad",
                        "name": "setA",
                        "properties": [
                            {
                                "uuid": "1d332b3b-94de-41fd-961d-9686f328bfe3",
                                "name": "a",
                                "static": null,
                                "scope": null
                            }
                        ]
                    },
                    "body": null
                }
            ]
        },
        "variables": {
            "uuid": "05762e8b-0b64-4170-99e4-0b8e0629fb14",
            "name": null,
            "static": null,
            "scope": null
        },
        "methods": [
            {
                "uuid": "587560ac-aca9-4d10-8f1f-7a3dac6a6db3",
                "signature": {
                    "uuid": "d227d270-c2c2-401e-bb98-c3297886c01f",
                    "name": "getB",
                    "properties": []
                },
                "body": null
            },
            {
                "uuid": "38502c84-4a9f-4e23-9b05-60f9b94b464e",
                "signature": {
                    "uuid": "800befcb-5b31-4c15-abe9-4e4afcaa67af",
                    "name": "setB",
                    "properties": [
                        {
                            "uuid": "d384acb9-7ad7-4bf3-b015-95d23577796c",
                            "name": "b",
                            "static": null,
                            "scope": null
                        }
                    ]
                },
                "body": null
            }
        ]
    },
    "variables": {
        "uuid": "56a734fc-b6b0-453f-8431-326c5fa0a397",
        "name": null,
        "static": null,
        "scope": null
    },
    "methods": [
        {
            "uuid": "be18f0fd-2c37-4a1a-8ca5-f09844721afa",
            "signature": {
                "uuid": "6ca73e6a-0658-4c33-801c-f3f77082edc6",
                "name": "getC",
                "properties": []
            },
            "body": null
        },
        {
            "uuid": "cfacdeae-839f-47a0-b4f6-2ead93280cad",
            "signature": {
                "uuid": "50af20ad-b2d9-418b-b982-5c541465f139",
                "name": "setC",
                "properties": [
                    {
                        "uuid": "cae5cd1e-3adf-47c3-a79d-b4b5b2fa9a2a",
                        "name": "c",
                        "static": null,
                        "scope": null
                    }
                ]
            },
            "body": null
        }
    ]
}

```