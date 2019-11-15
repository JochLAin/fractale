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
    "uuid": "e834b16b-33ea-4b0e-a202-7c9239010057",
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
            "_uuid": "c3d4ca12-b407-4d67-9f51-a2417bc77180",
            "_props": {
                "_uses": [],
                "_name": "A",
                "_properties": [
                    "c5a5c997-3b57-47f9-ab90-36593256a522"
                ],
                "_methods": [
                    "78a231da-0c05-4adc-976e-d6b4bc362989",
                    "477238c0-d014-4626-81fa-e32e04f8494a"
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
            "_uuid": "dec298f0-3e08-4667-808a-6af0b61eb97c",
            "_props": {
                "_uses": [],
                "_name": "B",
                "_properties": [
                    "ff60f8db-504e-4316-9e52-fc88e86d20bf"
                ],
                "_methods": [
                    "cf02afd7-a8ea-4768-aaaf-61ceeb2d5c80",
                    "50eded8c-c329-4ef0-ba9d-bb9bd9e05517"
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
            "_uuid": "77fb7f48-f034-42bd-b9ff-18db05cfa962",
            "_props": {
                "_uses": [
                    "c3d4ca12-b407-4d67-9f51-a2417bc77180",
                    "dec298f0-3e08-4667-808a-6af0b61eb97c"
                ],
                "_name": "C",
                "_inheritance": "dec298f0-3e08-4667-808a-6af0b61eb97c",
                "_properties": [
                    "19d70480-9301-4a63-a2ef-68e42f5127fc"
                ],
                "_methods": [
                    "20976cff-5e10-424f-a366-1fb8401f3425",
                    "cd6e9b84-0c98-48b5-8548-3a36da9be6ac"
                ]
            }
        }
    ]
}

```