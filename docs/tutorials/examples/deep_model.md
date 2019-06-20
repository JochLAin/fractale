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

### Results

```

{
    "uuid": "01e6b9f7-d566-4728-9cf7-05fec0158cd7",
    "uses": [
        {
            "uuid": "691516f6-dbbd-4809-9f17-90f1d0b79e77",
            "name": "A",
            "inheritance": null,
            "variables": {
                "uuid": "14a863c5-c351-4079-9adc-7f735a48d72c",
                "name": null,
                "static": null,
                "scope": null
            },
            "methods": [
                {
                    "uuid": "702fa199-7a03-474d-bd2f-b7a0ded0306a",
                    "signature": {
                        "uuid": "b702c2ad-1983-4114-8f30-43f6f9cdc4e4",
                        "name": "getA",
                        "properties": []
                    },
                    "body": null
                },
                {
                    "uuid": "6d59f202-f727-47d8-8469-3231dc17e0cd",
                    "signature": {
                        "uuid": "75e25129-8249-4ff0-a934-f660e78c83ca",
                        "name": "setA",
                        "properties": [
                            {
                                "uuid": "64ae12d1-a965-4ae3-9f74-1e2468b137f2",
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
            "uuid": "442ec332-cb3a-4c77-b7a4-9df1d9137cb9",
            "name": "B",
            "inheritance": null,
            "variables": {
                "uuid": "ef2106b3-62fd-4b46-903b-988da311c1f0",
                "name": null,
                "static": null,
                "scope": null
            },
            "methods": [
                {
                    "uuid": "e0d70149-1106-4723-ad0b-76502aa5e656",
                    "signature": {
                        "uuid": "3ea354d7-f960-4f0b-8d40-bd543242e13e",
                        "name": "getB",
                        "properties": []
                    },
                    "body": null
                },
                {
                    "uuid": "15647350-c82e-4dd6-a50c-aa3abf1434f1",
                    "signature": {
                        "uuid": "c8d2db5a-5da9-4f2a-b9e6-c9e085def82e",
                        "name": "setB",
                        "properties": [
                            {
                                "uuid": "17b82443-3385-40eb-b551-be4dd9e9da3f",
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
        "uuid": "78f2dcf2-58dd-43f3-a846-9c7a87cf59e0",
        "name": "C",
        "inheritance": {
            "uuid": "442ec332-cb3a-4c77-b7a4-9df1d9137cb9",
            "name": "B",
            "inheritance": null,
            "variables": {
                "uuid": "ef2106b3-62fd-4b46-903b-988da311c1f0",
                "name": null,
                "static": null,
                "scope": null
            },
            "methods": [
                {
                    "uuid": "e0d70149-1106-4723-ad0b-76502aa5e656",
                    "signature": {
                        "uuid": "3ea354d7-f960-4f0b-8d40-bd543242e13e",
                        "name": "getB",
                        "properties": []
                    },
                    "body": null
                },
                {
                    "uuid": "15647350-c82e-4dd6-a50c-aa3abf1434f1",
                    "signature": {
                        "uuid": "c8d2db5a-5da9-4f2a-b9e6-c9e085def82e",
                        "name": "setB",
                        "properties": [
                            {
                                "uuid": "17b82443-3385-40eb-b551-be4dd9e9da3f",
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
            "uuid": "c0d61383-1e16-4263-b3f3-2d2a6ae3f2e2",
            "name": null,
            "static": null,
            "scope": null
        },
        "methods": [
            {
                "uuid": "7cf7d961-dbac-4344-9293-e665e9c6bc72",
                "signature": {
                    "uuid": "aaefd528-d057-4c0d-a87d-a474bade205b",
                    "name": "getC",
                    "properties": []
                },
                "body": null
            },
            {
                "uuid": "8ad17083-e9f4-4877-9738-643d9c2d0544",
                "signature": {
                    "uuid": "cd3497f4-494e-4eff-a81a-70d95c5a5dec",
                    "name": "setC",
                    "properties": [
                        {
                            "uuid": "e88f29d8-88de-4659-9209-9b21845fcd89",
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