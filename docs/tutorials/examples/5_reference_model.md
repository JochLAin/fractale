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
    "uuid": "02c8ef36-c7a9-490d-b8dc-c5e63dccd09f",
    "uses": [],
    "name": "C",
    "inheritance": {
        "uuid": "77e9ad4a-0fcd-4701-a018-73b726d0bf10",
        "uses": [],
        "name": "B",
        "inheritance": {
            "uuid": "3f52aaa8-24c8-4d20-82a0-969265fa994d",
            "uses": [],
            "name": "A",
            "properties": [
                {
                    "uuid": "d28c2bfe-4377-4aac-95c4-0155805db107",
                    "name": "a"
                }
            ],
            "methods": [
                {
                    "uuid": "990b4e8f-afda-43f7-b38b-8857513840af",
                    "signature": {
                        "uuid": "647abb0a-a4cd-4432-ac7a-79a86796df6e",
                        "name": "getA",
                        "variables": []
                    }
                },
                {
                    "uuid": "0f4f46c2-ef14-4bbb-8f5c-d47106d25c35",
                    "signature": {
                        "uuid": "3c159030-5751-40fe-9a54-85b2a94c494d",
                        "name": "setA",
                        "variables": [
                            {
                                "uuid": "3e966d77-287a-47d4-aef5-6ad235d16214",
                                "name": "a"
                            }
                        ]
                    }
                }
            ]
        },
        "properties": [
            {
                "uuid": "521563a9-5d99-4423-9e5a-3f61fdb4face",
                "name": "b"
            }
        ],
        "methods": [
            {
                "uuid": "49954e62-ef99-4970-a4c4-76b68835c458",
                "signature": {
                    "uuid": "4e88a956-5019-4bc5-b723-6a4baa517e56",
                    "name": "getB",
                    "variables": []
                }
            },
            {
                "uuid": "3d0cc617-6baa-45ef-a29c-52dfeea26a15",
                "signature": {
                    "uuid": "98deec4e-c302-4617-abbf-2283e3e15e8a",
                    "name": "setB",
                    "variables": [
                        {
                            "uuid": "71ef0419-e48b-409a-8b33-26f6c167a003",
                            "name": "b"
                        }
                    ]
                }
            }
        ]
    },
    "properties": [
        {
            "uuid": "91fc10ab-5757-4181-99d0-1da0c37822cb",
            "name": "c"
        }
    ],
    "methods": [
        {
            "uuid": "cf4220df-ac4d-4976-b9ec-bdc46eb6dc68",
            "signature": {
                "uuid": "13b8b552-1f41-4311-913e-72e80e7164fe",
                "name": "getC",
                "variables": []
            }
        },
        {
            "uuid": "49d83296-f5b4-424f-a3dd-7344b569baee",
            "signature": {
                "uuid": "e67aeae0-c40f-4728-8483-360211ab298c",
                "name": "setC",
                "variables": [
                    {
                        "uuid": "4a877f4b-908e-4370-b888-e6930d229912",
                        "name": "c"
                    }
                ]
            }
        }
    ]
}
```