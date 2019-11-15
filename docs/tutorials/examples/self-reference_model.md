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
    "uuid": "5d0879d5-5ac1-49ea-aead-3387a98440a0",
    "uses": [],
    "name": "C",
    "inheritance": {
        "uuid": "dc7210d2-39d9-46c6-b28d-609329518e80",
        "uses": [],
        "name": "B",
        "inheritance": {
            "uuid": "99f37104-6b12-4e50-9a5f-4a3966d1ed7f",
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
                    "_uuid": "22e42938-4bf3-4615-9c2d-29786f786511",
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
                    "_uuid": "fa1f30f5-d3f0-4a83-977b-6acdafc4cc94",
                    "_props": {
                        "_signature": "693cf2ee-5872-4ce5-9ad2-c6ae58d4cc43"
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
                    "_uuid": "997c02ba-70d8-4bb6-bd83-f14fa6f0834c",
                    "_props": {
                        "_signature": "aee5a6e0-56c5-4ff1-89a4-6f5afbbbf217"
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
                "_uuid": "8bedd7ba-81fe-46e6-8bd3-778783e5f69f",
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
                "_uuid": "427e146f-c342-4733-bd74-dd53b639e2ff",
                "_props": {
                    "_signature": "b8b4a472-bfde-4b50-b10f-8e96de53cecf"
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
                "_uuid": "9a08dcc8-4841-4896-8f44-b2c6623bc86d",
                "_props": {
                    "_signature": "6115ffee-5e2f-4f07-8325-10470c2d3478"
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
            "_uuid": "ecfbfd59-49bc-4230-b4d4-c855b130b6de",
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
            "_uuid": "da545028-6061-4bb5-858d-cc00841c18a2",
            "_props": {
                "_signature": "f67cb44c-7780-4248-979c-8dcc1b1e010e"
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
            "_uuid": "c91e12f2-4016-4ce2-a18c-39f7106db9a8",
            "_props": {
                "_signature": "1daa0274-36ca-474f-bf12-dad734489182"
            }
        }
    ]
}

```