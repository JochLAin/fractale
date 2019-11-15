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

const a = new Class({
    name: 'A',
    properties: [{ name: 'a', value: 0 }],
    methods: [
        { signature: { name: 'getA' }},
        { signature: { name: 'setA', variables: [{ name: 'a' }] }}
    ]
});

const b = new Class({
    name: 'B',
    properties: [
        { name: 'b', value: 0 },
    ],
    methods: [
        { signature: { name: 'getB' }},
        { signature: { name: 'setB', variables: [{ name: 'b' }] }}
    ]
});

const c = new Class({
    uses: [a, b],
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

const program = new Program({
    classes: [a,b,c],
});

if (a.properties[0].name !== 'a') {
    throw new Error('Error on deep accessor variable name');
}
if (c.uses[0].name !== 'A') {
    throw new Error('Error on deep accessor with brace');
}
if (c.inheritance.name !== 'B') {
    throw new Error('Error on deep accessor');
}

if (!program.serialize()) {
    throw new Error('Error on deep serialize');
}

resolve(program.serialize());

```

### Results

```

{
    "uuid": "0734a97a-756c-4fc9-a25b-efa732384261",
    "classes": [
        {
            "__events": {
                "change": {
                    "listeners": [
                        null,
                        null
                    ]
                }
            },
            "_uuid": "e1756276-ed42-4e74-85a4-25ecf46887a1",
            "_props": {
                "_uses": [],
                "_name": "A",
                "_properties": [
                    "eea1a434-635c-4f0a-819e-a438cabaecbc"
                ],
                "_methods": [
                    "9d65bba0-26cd-49e0-9116-5467c1c42b72",
                    "223c7ec8-620d-47cb-b8dd-3d232ba077e4"
                ]
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
            "_uuid": "6204f13f-67b2-4e4b-af0a-5f92467dded3",
            "_props": {
                "_uses": [],
                "_name": "B",
                "_properties": [
                    "79e20e17-fabf-40e2-a12d-4b2e72908cba"
                ],
                "_methods": [
                    "356ea5c0-6a85-4c17-b671-47bd09797d33",
                    "456b3957-3418-4dcf-8fc8-eebb3dc4635c"
                ]
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
            "_uuid": "493da48e-b1cc-44ef-ab90-118b9206a690",
            "_props": {
                "_uses": [
                    "e1756276-ed42-4e74-85a4-25ecf46887a1",
                    "6204f13f-67b2-4e4b-af0a-5f92467dded3"
                ],
                "_name": "C",
                "_inheritance": "6204f13f-67b2-4e4b-af0a-5f92467dded3",
                "_properties": [
                    "77e81ae5-7be5-457f-9fab-3474dc1528ba"
                ],
                "_methods": [
                    "d902438d-b562-4e4d-ac26-6c0fb50d490f",
                    "5d9d4051-0e4b-4caf-9da9-153144c18448"
                ]
            }
        }
    ]
}

```