<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```

const Variable = Fractale.create("Variable", {
    name: String,
    value: undefined,
    static: Boolean,
    scope: String
});

const Method = Fractale.create("Method", {
    signature: {
        name: String,
        variables: [
            Variable
        ]
    },
    body: String
});

const Class = Fractale.create("Class", {
    uses: [
        Fractale.SELF
    ],
    name: String,
    inheritance: Fractale.SELF,
    properties: [
        Variable
    ],
    methods: [
        Method
    ]
});

```

</div></article>

```

const _a = new Variable({ name: 'a', value: 0 });
const a = new Class({
    name: 'A',
    properties: [_a],
    methods: [
        { signature: { name: 'getA' }},
        { signature: { name: 'setA', variables: [{ name: 'a' }] }}
    ]
});

const b = new Class({
    name: 'B',
    inheritance: a,
    properties: [
        { name: 'b', value: 0 },
    ],
    methods: [
        { signature: { name: 'getB' }},
        { signature: { name: 'setB', variables: [{ name: 'b' }] }}
    ]
});

const c = new Class({
    name: 'C',
    inheritance: b,
    properties: [
        { name: 'c', value: 0 },
    ],
    methods: [
        { signature: { name: 'getC' }},
        { signature: { name: 'setC', variables: [{ name: 'c' }] }}
    ]
});

if (a.properties[0].name !== 'a') {
    throw new Error('Error on deep accessor variable name');
}
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
    "uuid": "ee37d84f-c637-4341-be32-f140e4452f4e",
    "uses": [],
    "name": "C",
    "inheritance": {
        "uuid": "75b1ca18-9030-49d4-b74a-614e6367f841",
        "uses": [],
        "name": "B",
        "inheritance": {
            "uuid": "594793c2-969c-4e31-a9f7-0e2ed8473794",
            "uses": [],
            "name": "A",
            "properties": [
                {
                    "__events": {
                        "change": {
                            "listeners": [
                                null,
                                null
                            ]
                        }
                    },
                    "_uuid": "4dfa5045-6917-47d6-bbdc-a4ba9f130fd5",
                    "_props": {
                        "_name": "a"
                    }
                }
            ],
            "methods": [
                {
                    "__events": {
                        "change": {
                            "listeners": [
                                null,
                                null
                            ]
                        }
                    },
                    "_uuid": "90c2ed01-0aad-428f-a7b5-c80358cb09e6",
                    "_props": {
                        "_signature": "8637513d-9400-45f7-9fcf-6c5fc99b9125"
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
                    "_uuid": "a4795c3c-6678-4ace-bc14-88f2fed9c86a",
                    "_props": {
                        "_signature": "925cc8f4-25e4-492c-9654-8247927fe1d9"
                    }
                }
            ]
        },
        "properties": [
            {
                "__events": {
                    "change": {
                        "listeners": [
                            null,
                            null
                        ]
                    }
                },
                "_uuid": "4a71bbe4-3a84-4ddb-bd10-bfb33cd47088",
                "_props": {
                    "_name": "b"
                }
            }
        ],
        "methods": [
            {
                "__events": {
                    "change": {
                        "listeners": [
                            null,
                            null
                        ]
                    }
                },
                "_uuid": "bc18cafe-65d5-45f8-937e-38299c7d7826",
                "_props": {
                    "_signature": "e2838d29-d88a-4e57-a33e-ff33d4ed496e"
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
                "_uuid": "1fedc96f-6ecb-4768-938b-7438d7c0e87e",
                "_props": {
                    "_signature": "1d594764-17ec-49e0-bc34-a6281e775d6e"
                }
            }
        ]
    },
    "properties": [
        {
            "__events": {
                "change": {
                    "listeners": [
                        null,
                        null
                    ]
                }
            },
            "_uuid": "06ea8923-6646-4cb0-a3e4-80a6cc1d613a",
            "_props": {
                "_name": "c"
            }
        }
    ],
    "methods": [
        {
            "__events": {
                "change": {
                    "listeners": [
                        null,
                        null
                    ]
                }
            },
            "_uuid": "5e85cac5-7f33-4657-8c53-ba64afbe946e",
            "_props": {
                "_signature": "aa1220dd-783d-462f-a3c1-d022cbb50a1b"
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
            "_uuid": "3611ac23-5794-41a4-90ab-9f14a23a3d90",
            "_props": {
                "_signature": "8bed472b-544c-413d-a075-f0399f941ebb"
            }
        }
    ]
}

```