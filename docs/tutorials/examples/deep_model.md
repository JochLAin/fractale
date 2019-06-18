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

const program = new Program({
    uses: [a, b],
    class: c
});

if (program.uses[0].name !== 'A') {
    throw new Error('Error on deep accessor with brace');
}
if (program.props.use(1).name !== 'B') {
    throw new Error('Error on deep accessor with function singular');
}
if (program.class.inheritance.name !== 'B') {
    throw new Error('Error on deep accessor');
}

if (!program.serialize()) {
    throw new Error('Error on deep serialize');
}

resolve(program.serialize());

```

### Console

```

{
    "uuid": "179c4843-22d0-4ad6-a14c-160cc9175b6e",
    "uses": [
        {
            "uuid": "6ace85bf-3de6-4115-bb73-e73cfb76e452",
            "name": "A",
            "inheritance": null,
            "variables": {
                "uuid": "a6b94b9a-ebd5-4ac2-88fb-7db99ffafa36",
                "name": null,
                "static": null,
                "scope": null
            },
            "methods": [
                {
                    "uuid": "bc46c2f8-ad21-476d-a661-97107a4a9bca",
                    "signature": {
                        "uuid": "339dfdaf-e64b-4d34-8e78-d7da60331657",
                        "name": "getA",
                        "properties": []
                    },
                    "body": null
                },
                {
                    "uuid": "8583de27-c738-4c5a-905d-a9ad4ab85ea8",
                    "signature": {
                        "uuid": "c452c6ae-bc77-4ce6-b52b-802a5f689817",
                        "name": "setA",
                        "properties": [
                            {
                                "uuid": "9776f471-e468-4ef9-a0fb-3ff557f8b2cc",
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
        {
            "uuid": "e18191a8-1def-423c-a617-62d640f0f712",
            "name": "B",
            "inheritance": null,
            "variables": {
                "uuid": "b1f45ebe-dd7d-487e-aadb-665116d1da46",
                "name": null,
                "static": null,
                "scope": null
            },
            "methods": [
                {
                    "uuid": "592f8aa1-05d1-4be2-b303-d8142e7cec99",
                    "signature": {
                        "uuid": "b0629fc8-ecbf-40c0-8b54-61187b3c550d",
                        "name": "getB",
                        "properties": []
                    },
                    "body": null
                },
                {
                    "uuid": "2dd5b726-cece-42ca-a590-33d82b17f480",
                    "signature": {
                        "uuid": "8e287a9b-9322-4243-b684-b28214e63346",
                        "name": "setB",
                        "properties": [
                            {
                                "uuid": "9daed994-0623-48e9-9535-383231248043",
                                "name": "b",
                                "static": null,
                                "scope": null
                            }
                        ]
                    },
                    "body": null
                }
            ]
        }
    ],
    "class": {
        "uuid": "cdcaf259-db57-4a98-bf88-443463382cd9",
        "name": "C",
        "inheritance": {
            "uuid": "e18191a8-1def-423c-a617-62d640f0f712",
            "name": "B",
            "inheritance": null,
            "variables": {
                "uuid": "b1f45ebe-dd7d-487e-aadb-665116d1da46",
                "name": null,
                "static": null,
                "scope": null
            },
            "methods": [
                {
                    "uuid": "592f8aa1-05d1-4be2-b303-d8142e7cec99",
                    "signature": {
                        "uuid": "b0629fc8-ecbf-40c0-8b54-61187b3c550d",
                        "name": "getB",
                        "properties": []
                    },
                    "body": null
                },
                {
                    "uuid": "2dd5b726-cece-42ca-a590-33d82b17f480",
                    "signature": {
                        "uuid": "8e287a9b-9322-4243-b684-b28214e63346",
                        "name": "setB",
                        "properties": [
                            {
                                "uuid": "9daed994-0623-48e9-9535-383231248043",
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
            "uuid": "8e6f44ee-5eb1-4f82-9389-49839363e21c",
            "name": null,
            "static": null,
            "scope": null
        },
        "methods": [
            {
                "uuid": "582f4183-a918-4203-a2ce-ffaacdc8fbc6",
                "signature": {
                    "uuid": "5421a361-7cda-4337-b92c-0ff21dad22fe",
                    "name": "getC",
                    "properties": []
                },
                "body": null
            },
            {
                "uuid": "2fec758f-d2f7-4dc0-bc5e-6512fe006999",
                "signature": {
                    "uuid": "4323bf4e-bbd4-423d-acc4-f78d70bcd0c9",
                    "name": "setC",
                    "properties": [
                        {
                            "uuid": "d5af2189-15c6-4552-870f-1e267426b1f7",
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
}

```