<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```

const Character = Fractale.create("Character", {
    name: String,
    preview: Sprite,
    dashes: [
        Sprite
    ],
    stand: {
        bottom: Sprite,
        left: Sprite,
        right: Sprite,
        top: Sprite
    },
    move: {
        bottom: Sprite,
        left: Sprite,
        right: Sprite,
        top: Sprite
    }
});

const Sprite = Fractale.create("Sprite", {
    frames: [
        Frame
    ],
    height: Number,
    width: Number
});

const Frame = Fractale.create("Frame", {
    layers: [
        Layer
    ],
    height: Number,
    width: Number
});

const Layer = Fractale.create("Layer", {
    pixels: [
        String
    ],
    height: Number,
    width: Number
});

const Game = Fractale.create("Game", {
    name: String,
    type: String,
    characters: [
        Character
    ]
});

```

</div></article>

```

const PIXELS = [
    '#000000', '#000111', '#000222', '#000333', '#000444', '#000555', '#000666', '#000777', '#000888', '#000999',
    '#111000', '#111111', '#111222', '#111333', '#111444', '#111555', '#111666', '#111777', '#111888', '#111999',
    '#222000', '#222111', '#222222', '#222333', '#222444', '#222555', '#222666', '#222777', '#222888', '#222999',
    '#333000', '#333111', '#333222', '#333333', '#333444', '#333555', '#333666', '#333777', '#333888', '#333999',
    '#444000', '#444111', '#444222', '#444333', '#444444', '#444555', '#444666', '#444777', '#444888', '#444999',
    '#555000', '#555111', '#555222', '#555333', '#555444', '#555555', '#555666', '#555777', '#555888', '#555999',
    '#666000', '#666111', '#666222', '#666333', '#666444', '#666555', '#666666', '#666777', '#666888', '#666999',
    '#777000', '#777111', '#777222', '#777333', '#777444', '#777555', '#777666', '#777777', '#777888', '#777999',
    '#888000', '#888111', '#888222', '#888333', '#888444', '#888555', '#888666', '#888777', '#888888', '#888999',
    '#999000', '#999111', '#999222', '#999333', '#999444', '#999555', '#999666', '#999777', '#999888', '#999999',
];

const SPRITE = {
    height: 10,
    width: 10,
    frames: [{
        layers: [
            { pixels: PIXELS },
            { pixels: PIXELS },
            { pixels: PIXELS },
            { pixels: PIXELS },
            { pixels: PIXELS },
            { pixels: PIXELS }
        ]
    }]
};

const CHARACTER = {
    name: 'Toto',
    move: {
        bottom: SPRITE,
        left: SPRITE,
        right: SPRITE,
        top: SPRITE,
    },
    stand: {
        bottom: SPRITE,
        left: SPRITE,
        right: SPRITE,
        top: SPRITE,
    },
};

const game = new Game({
    name: 'The ultimate game',
    characters: [
        CHARACTER,
        CHARACTER,
        CHARACTER,
        CHARACTER,
        CHARACTER,
        CHARACTER,
        CHARACTER,
        CHARACTER,
        CHARACTER,
        CHARACTER,
        CHARACTER,
        CHARACTER
    ]
});

const character = game.characters[0];
const frame = character.move.bottom.frames[0];
const layer = frame.layers[0];
if (layer.pixel(3) !== '#000333') {
    throw new Error('Error on huge accessor');
}

if (!game.serialize()) {
    throw new Error('Error on huge serialize');
}

resolve(game.serialize());

```

### Results

```

{
    "uuid": "df43d906-0ac6-405f-af48-d76e878abc55",
    "name": "The ultimate game",
    "characters": [
        {
            "__events": {
                "change": {
                    "listeners": [
                        null,
                        null
                    ]
                }
            },
            "_uuid": "1b2e9e9e-8485-485d-a441-7e62652b4ac7",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "2b876300-7f63-43e1-a139-7debddbd5856",
                "_move": "dbb678dc-2a59-4461-ac86-cc54ee4a6bce"
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
            "_uuid": "d7f772f2-303e-42d4-9fe6-eae839ea503e",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "c82635f0-5b91-44d2-b2bf-586385b9a837",
                "_move": "edab5e3c-4fb4-4bc0-99f4-e920d9b93b34"
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
            "_uuid": "50d1cca8-16a3-4c04-90c6-e05da2d4ca6b",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "78c208cc-0974-46d5-98bc-fe1ca80a03e5",
                "_move": "b9394f84-9f0a-49de-8e5f-63428692e5fe"
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
            "_uuid": "82b8d50d-ddfa-4621-af90-8791e59edfff",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "aed39b45-ca7d-49f6-adb3-7bf491cb7844",
                "_move": "07a3962d-13f8-4d71-b659-ef8eef5da2ac"
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
            "_uuid": "5ad01490-a4fa-419c-8ed0-44e00f2ee5a8",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "52bb061d-547f-45a7-86a9-7ff40cfd7f7d",
                "_move": "d607ca8d-dcb5-48a7-827a-7dce22073ec0"
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
            "_uuid": "47d42ca6-beba-4bd0-bf72-1bd5e6f43467",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "bbb14fab-d744-4621-ada2-d400048dd79b",
                "_move": "e4c95679-c358-421e-a2e2-891f5653f55e"
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
            "_uuid": "722deeb2-4234-45fa-96f7-b7b4010e49c7",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "074576f5-345e-4f4b-a4e9-94c46d5088ed",
                "_move": "50e96443-c473-4f66-a4c2-4abd43a5d1bc"
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
            "_uuid": "5bc549a6-440b-496c-8c62-a02955bd7bd6",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "8cda655c-f4fa-48e3-8ca7-7eabe010b581",
                "_move": "3660c8d8-ccc5-4111-8498-d35a8baa3cb2"
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
            "_uuid": "1d5223a6-5985-4d16-b613-1ff1067f5e39",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "5f8d5df4-1d09-4483-a215-a2bfa26ebca4",
                "_move": "f65ca350-44c7-4efc-8c0f-14c329b613e2"
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
            "_uuid": "452018e5-2e55-41b7-81c8-e08086935ada",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "0046219e-3540-45c1-b5c4-d5240d5a4ab9",
                "_move": "d10d0d23-f04e-43e9-9ca7-906e37ec387f"
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
            "_uuid": "131b80f9-7ad8-4381-b421-c0cd9deec1da",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "ff16ec26-90cb-4a66-996a-4602dcb4ea98",
                "_move": "5b6d48f6-e961-465d-b754-5cdd42daf9de"
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
            "_uuid": "438efc24-7539-498b-9a9d-033e76dd92fa",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "09caaf8e-e274-40ac-8daa-ff9151ca70e6",
                "_move": "34253e35-738b-44e5-a17b-ee5b3bd45edd"
            }
        }
    ]
}

```