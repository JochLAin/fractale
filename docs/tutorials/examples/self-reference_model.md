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

### Console

```

{
    "uuid": "6a01d26f-a89a-4e0f-afef-be313e950a9a",
    "name": "C",
    "inheritance": {
        "uuid": "eb76e0ee-fcbe-4631-8a6e-412c1ec3c603",
        "name": "B",
        "inheritance": {
            "uuid": "2453811b-2e6b-431c-9db7-b3c2720709c2",
            "name": "A",
            "inheritance": null,
            "variables": {
                "uuid": "e2366094-811c-4d65-bce9-533357fc9271",
                "name": null,
                "static": null,
                "scope": null
            },
            "methods": [
                {
                    "uuid": "84098e01-1d35-42c7-8e0c-e875f5679126",
                    "signature": {
                        "uuid": "25fde708-cdcb-4a5e-9854-d0662177c4a6",
                        "name": "getA",
                        "properties": []
                    },
                    "body": null
                },
                {
                    "uuid": "f51747cf-1018-49d1-a1d6-678516edf3fc",
                    "signature": {
                        "uuid": "b269be64-ee53-469d-8cbf-e2fa219b6370",
                        "name": "setA",
                        "properties": [
                            {
                                "uuid": "7c7f2ae7-d5dd-4350-a836-c17159dc4305",
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
            "uuid": "6c1ac2b8-3269-453a-98a3-03bdc37f18f1",
            "name": null,
            "static": null,
            "scope": null
        },
        "methods": [
            {
                "uuid": "2374acad-116c-42cd-9df7-8fd162c269aa",
                "signature": {
                    "uuid": "0a34cd12-c47c-4e8e-9e51-2c7dcb34fcb4",
                    "name": "getB",
                    "properties": []
                },
                "body": null
            },
            {
                "uuid": "a34d0776-4c67-4b99-9a2f-3492b346678a",
                "signature": {
                    "uuid": "395d1001-3a82-474d-9fee-a6507d73f905",
                    "name": "setB",
                    "properties": [
                        {
                            "uuid": "390a2a42-d6f8-4597-948f-6daf4bce335b",
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
        "uuid": "a876f819-d55c-43c2-8aa4-38cc34919fa9",
        "name": null,
        "static": null,
        "scope": null
    },
    "methods": [
        {
            "uuid": "3f919ca1-ce30-4ba5-88d3-aa5461da4361",
            "signature": {
                "uuid": "56c60669-9217-4cd7-bf95-a2376e9b6530",
                "name": "getC",
                "properties": []
            },
            "body": null
        },
        {
            "uuid": "6107ba32-2b60-46f5-8060-e9216679a321",
            "signature": {
                "uuid": "f1ba27cd-a450-4b24-bcda-b2b102065ec0",
                "name": "setC",
                "properties": [
                    {
                        "uuid": "bd76851b-efe7-4cb0-90a5-03fee9bd1cbf",
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