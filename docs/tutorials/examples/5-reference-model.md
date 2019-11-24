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

resolve(c);
```

### Results

```json
{
    "uuid": "eac753d8-f595-493a-8080-e7ce3ff7843d",
    "uses": [],
    "name": "C",
    "inheritance": {
        "uuid": "7354ad9b-8b52-4498-990b-459d07fd87e5",
        "uses": [],
        "name": "B",
        "inheritance": {
            "uuid": "4975b754-b16d-439a-8e11-c0345766d681",
            "uses": [],
            "name": "A",
            "properties": [
                {
                    "uuid": "54c67039-7918-4712-9713-beb4d649a6c8",
                    "name": "a"
                }
            ],
            "methods": [
                {
                    "uuid": "d39177ca-e088-4431-ba9d-e377ee4830e6",
                    "signature": {
                        "uuid": "fa8e7c50-6792-4d55-a921-a698b51502a4",
                        "name": "getA",
                        "variables": []
                    }
                },
                {
                    "uuid": "824bf4a6-f0a1-438a-b0ce-85fa3a5652ef",
                    "signature": {
                        "uuid": "53aa9124-b012-4daa-ad2e-db30c2d25e6b",
                        "name": "setA",
                        "variables": [
                            {
                                "uuid": "ca50bf64-3d6d-470a-a351-d23cca6fb839",
                                "name": "a"
                            }
                        ]
                    }
                }
            ]
        },
        "properties": [
            {
                "uuid": "c9cc07bf-164e-4af9-a96d-c0e9340cb60f",
                "name": "b"
            }
        ],
        "methods": [
            {
                "uuid": "a44650ea-e7c2-4cfe-95f9-2f86b7204144",
                "signature": {
                    "uuid": "bf3d8b57-55a1-4a5a-82e5-3a8b7b586c2d",
                    "name": "getB",
                    "variables": []
                }
            },
            {
                "uuid": "1826a1f8-efab-405c-b3ff-c9f5b31277bb",
                "signature": {
                    "uuid": "5cb92508-1787-4829-9757-e0f213b99c73",
                    "name": "setB",
                    "variables": [
                        {
                            "uuid": "3397dbfb-06f3-4ece-9261-ed3d219cc40b",
                            "name": "b"
                        }
                    ]
                }
            }
        ]
    },
    "properties": [
        {
            "uuid": "917629fa-65e8-4ba0-9443-127d308f01f0",
            "name": "c"
        }
    ],
    "methods": [
        {
            "uuid": "144ceb51-1983-4e96-8210-bc0e1b8237f9",
            "signature": {
                "uuid": "c32c575c-1799-4f61-a40e-a9907666f08c",
                "name": "getC",
                "variables": []
            }
        },
        {
            "uuid": "3437c495-55de-4fe7-a07c-4a1048c351c1",
            "signature": {
                "uuid": "af1ca30d-79ea-4f49-b3fc-f0613b0a7b28",
                "name": "setC",
                "variables": [
                    {
                        "uuid": "60b9e3a6-52e9-45a7-9262-b67bcc3c96aa",
                        "name": "c"
                    }
                ]
            }
        }
    ]
}
```