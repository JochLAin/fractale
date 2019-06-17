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
    inheritance: a,
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
### Console
```
{
    "uuid": "c078422d-dbf7-459b-a93a-088a29f13778",
    "name": "C",
    "inheritance": {
        "uuid": "ecb10dea-6cfa-46e2-aa9b-085a818368d8",
        "name": "B",
        "inheritance": {
            "uuid": "2b9b5b9c-75ff-4a90-a28e-e869847e111b",
            "name": "A",
            "inheritance": null,
            "variables": {
                "uuid": "735e04af-ac9f-4320-ab19-8ecf18394468",
                "name": null,
                "static": null,
                "scope": null
            },
            "methods": [
                {
                    "uuid": "5080f0e9-e337-4b34-a3d9-8e23ba50860b",
                    "signature": {
                        "uuid": "d178b14f-49ce-4a03-85a6-ad7d52de1a60",
                        "name": "getA",
                        "properties": []
                    },
                    "body": null
                },
                {
                    "uuid": "aedd5d05-67b7-4182-a8e9-7ec704c2a69b",
                    "signature": {
                        "uuid": "ff1fb48c-e382-4caf-a972-72401b9f4271",
                        "name": "setA",
                        "properties": [
                            {
                                "uuid": "2aca9558-455e-4039-b2c9-bbb348425cc2",
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
        "variables": {
            "uuid": "2dee6fec-aaf2-45bf-81f8-bbbc94aef0cb",
            "name": null,
            "static": null,
            "scope": null
        },
        "methods": [
            {
                "uuid": "3ac86a5a-9c02-4746-a365-19a665d6cf63",
                "signature": {
                    "uuid": "097d41e3-c09c-4efe-a8d7-5ead836ed3b6",
                    "name": "getB",
                    "properties": []
                },
                "body": null
            },
            {
                "uuid": "ab6a59a9-7bda-4f82-bd3d-53fc9ba243a9",
                "signature": {
                    "uuid": "f42868bd-1b6f-441e-83ee-97210477af69",
                    "name": "setB",
                    "properties": [
                        {
                            "uuid": "f53aaf22-9e42-4067-8aa3-c3ae38747d4a",
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
        "uuid": "47875393-98ab-48ca-927f-afe5214a4a6b",
        "name": null,
        "static": null,
        "scope": null
    },
    "methods": [
        {
            "uuid": "ad8d8760-fe32-4e7e-a85e-594a87e71efd",
            "signature": {
                "uuid": "3f9f778b-7889-433a-a863-f66f4c169aef",
                "name": "getC",
                "properties": []
            },
            "body": null
        },
        {
            "uuid": "77a9c353-4137-445f-ae38-e6cc6c8298a9",
            "signature": {
                "uuid": "75787111-d0b1-419a-a0d5-3488c4fbd16b",
                "name": "setC",
                "properties": [
                    {
                        "uuid": "84031f06-7ea0-4bda-82b8-2e205c438af3",
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
```