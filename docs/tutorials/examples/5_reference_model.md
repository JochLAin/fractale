<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```javascript
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

```javascript
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

```json
{
    "uuid": "3ca11bb4-be51-4b90-945d-59785fa1dbd7",
    "uses": [],
    "name": "C",
    "inheritance": {
        "uuid": "70dd5e32-078f-4b03-82de-a81ebba9cebe",
        "uses": [],
        "name": "B",
        "inheritance": {
            "uuid": "8e3d81db-5b96-45d4-a5fe-f03f48a5dd91",
            "uses": [],
            "name": "A",
            "properties": [
                {
                    "uuid": "27cfe111-02c9-4e8d-abc3-e7a2d536e0cb",
                    "name": "a"
                }
            ],
            "methods": [
                {
                    "uuid": "df399907-ac8e-4adf-bea9-96b82a5b395d",
                    "signature": {
                        "uuid": "aec7b95f-8235-4e9b-bd73-3cde67747a8b",
                        "name": "getA",
                        "variables": []
                    }
                },
                {
                    "uuid": "a6fabfee-8005-4e68-afbd-770ad5035008",
                    "signature": {
                        "uuid": "2f37039b-d04a-4b2e-b0c2-0f6dbb2d2ad3",
                        "name": "setA",
                        "variables": [
                            {
                                "uuid": "aa790b11-71a7-4310-8f5f-83f40b0ad152",
                                "name": "a"
                            }
                        ]
                    }
                }
            ]
        },
        "properties": [
            {
                "uuid": "d6d551dd-818e-41b0-8b13-cc5c81a13918",
                "name": "b"
            }
        ],
        "methods": [
            {
                "uuid": "3cedc676-a0cf-4d02-a3b9-3598ebd64767",
                "signature": {
                    "uuid": "62264959-8797-4452-a4ec-24cd025b74bc",
                    "name": "getB",
                    "variables": []
                }
            },
            {
                "uuid": "9fd17c32-7439-49f1-a381-bdbfac82a1e9",
                "signature": {
                    "uuid": "2b8db5cd-0777-406c-abb0-20b9d9439f44",
                    "name": "setB",
                    "variables": [
                        {
                            "uuid": "e82386b6-1b19-4334-9b0e-15cbb0d35071",
                            "name": "b"
                        }
                    ]
                }
            }
        ]
    },
    "properties": [
        {
            "uuid": "0b1b5e00-7f88-4cae-a5bd-a4c8b28ea916",
            "name": "c"
        }
    ],
    "methods": [
        {
            "uuid": "6d91debf-4138-42f1-b933-b895e4ed298f",
            "signature": {
                "uuid": "d1cefe2c-362d-4013-ac60-e4b1673fa857",
                "name": "getC",
                "variables": []
            }
        },
        {
            "uuid": "77060f31-75bd-470d-8c17-0ec0d363664c",
            "signature": {
                "uuid": "3db71db5-c049-467a-8a5f-e9d3731eb282",
                "name": "setC",
                "variables": [
                    {
                        "uuid": "c63dbd8f-550d-4129-881f-690c5bb76035",
                        "name": "c"
                    }
                ]
            }
        }
    ]
}
```