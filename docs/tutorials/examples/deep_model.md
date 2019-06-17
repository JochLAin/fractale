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
    "uuid": "d577da86-c1b4-416f-b4dd-4b426728b638",
    "uses": [
        {
            "uuid": "f3acf91d-96dd-4c70-96ec-734006ae30ca",
            "name": "A",
            "inheritance": null,
            "variables": {
                "uuid": "824fef1d-1c32-47e1-b7dd-1c5030ca22fe",
                "name": null,
                "static": null,
                "scope": null
            },
            "methods": [
                {
                    "uuid": "6fd4b360-a4a6-4f64-afb7-e22b28e48be3",
                    "signature": {
                        "uuid": "8a3145dc-f02a-4175-96b3-a7b595856331",
                        "name": "getA",
                        "properties": []
                    },
                    "body": null
                },
                {
                    "uuid": "24e43e27-a63d-4c71-b7d3-4dae077b7bca",
                    "signature": {
                        "uuid": "7582e694-db49-4651-be3c-cbdabc30a91f",
                        "name": "setA",
                        "properties": [
                            {
                                "uuid": "7b881298-1cb6-48cc-9d5b-7da0dc7e6b74",
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
            "uuid": "c27f7e0b-f628-410e-b936-fa8d9b712022",
            "name": "B",
            "inheritance": null,
            "variables": {
                "uuid": "383de238-545b-4148-8cd9-87b2addc761b",
                "name": null,
                "static": null,
                "scope": null
            },
            "methods": [
                {
                    "uuid": "e57e59b8-892c-4ab2-9a8e-da0560065ada",
                    "signature": {
                        "uuid": "3d4afa7e-6a1d-46f3-b98a-595cbcc93eb8",
                        "name": "getB",
                        "properties": []
                    },
                    "body": null
                },
                {
                    "uuid": "b0a7cd8c-89d3-4fba-b57b-55d8ce4f4c71",
                    "signature": {
                        "uuid": "d37b292e-dc05-4792-8de3-45f0f0c80de3",
                        "name": "setB",
                        "properties": [
                            {
                                "uuid": "08956620-cdae-4ae2-adcc-1a7160c36799",
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
        "uuid": "ca12bdfd-c846-4108-baf9-d21307f6c022",
        "name": "C",
        "inheritance": {
            "uuid": "c27f7e0b-f628-410e-b936-fa8d9b712022",
            "name": "B",
            "inheritance": null,
            "variables": {
                "uuid": "383de238-545b-4148-8cd9-87b2addc761b",
                "name": null,
                "static": null,
                "scope": null
            },
            "methods": [
                {
                    "uuid": "e57e59b8-892c-4ab2-9a8e-da0560065ada",
                    "signature": {
                        "uuid": "3d4afa7e-6a1d-46f3-b98a-595cbcc93eb8",
                        "name": "getB",
                        "properties": []
                    },
                    "body": null
                },
                {
                    "uuid": "b0a7cd8c-89d3-4fba-b57b-55d8ce4f4c71",
                    "signature": {
                        "uuid": "d37b292e-dc05-4792-8de3-45f0f0c80de3",
                        "name": "setB",
                        "properties": [
                            {
                                "uuid": "08956620-cdae-4ae2-adcc-1a7160c36799",
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
            "uuid": "37402edb-8d63-43f7-ad72-611992310923",
            "name": null,
            "static": null,
            "scope": null
        },
        "methods": [
            {
                "uuid": "d7a8a346-57d8-4337-8532-bcf1ff239de6",
                "signature": {
                    "uuid": "b6fa18a4-ad23-4b1d-b1f5-1414a647035f",
                    "name": "getC",
                    "properties": []
                },
                "body": null
            },
            {
                "uuid": "d62f8b3f-54a4-4d20-91d1-c125ad9621f1",
                "signature": {
                    "uuid": "ed210616-6388-4ee7-8b83-250e4f5d8e96",
                    "name": "setC",
                    "properties": [
                        {
                            "uuid": "e1615726-f15a-408f-9a9a-736e02122362",
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