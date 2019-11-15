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
    "uuid": "b4f89947-af93-48a2-aec1-cb5654fdbd14",
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
            "_uuid": "10b770bd-93f7-4d2f-acb5-b5c983af38bf",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "fc9a75cd-835c-46a3-b17f-c1936af97dc4",
                "_move": "fb7274ae-e8d0-4fbc-b736-76a91c395f16"
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
            "_uuid": "00cd83a9-b3d0-4e66-88cf-e180a5da15af",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "adfc3a55-7924-48af-9c61-977ed40e82d9",
                "_move": "70481998-86af-4860-9c67-515bbfabab4c"
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
            "_uuid": "c238321c-dd44-4b92-bab6-86e4ed17a3be",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "3c60a942-98a2-4e53-abf9-604637bd644e",
                "_move": "fa72098a-34cb-4861-980e-059bb3b35abc"
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
            "_uuid": "c2c0967f-f933-466d-99b2-39c744f6e04c",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "f1954fcf-d0fc-49b7-a122-1afd6a32a4a5",
                "_move": "4983b5f8-36ad-454e-a84a-de43659691b1"
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
            "_uuid": "d50b5c65-60ff-450d-9264-3bf35c4c28d5",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "0eadca95-3ea8-4062-b8b5-f64663608d4d",
                "_move": "d46a2174-2b30-4aa8-9ff9-80a9bc08da87"
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
            "_uuid": "f1d2ae79-681d-419b-8390-7ebe1da14c3c",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "88b5b31e-dc31-4a51-94d5-ceea7f32014a",
                "_move": "646319eb-0b7f-4635-b9f5-964b3774904f"
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
            "_uuid": "e23c6172-a422-4d7e-952f-7a7b63a6c424",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "a61c3962-cce9-4dbe-9bbb-d840ec4cab4d",
                "_move": "dcf8adea-2cb5-4112-8eb7-4eb505e21066"
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
            "_uuid": "dc769d49-1365-4dbc-9249-214643d743ce",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "5f90b1fb-e1f5-4bcc-9bed-fe7b452c9649",
                "_move": "647401d3-983d-4b11-a63f-956dfa550767"
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
            "_uuid": "a15f8219-65a4-43b5-8f45-cf977506a025",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "4bb2da31-c9f3-4cc5-bb5b-b4adaff53230",
                "_move": "5c42ee8e-293d-48b1-9201-143dc0bcd1ad"
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
            "_uuid": "f06a7c34-ec27-42d3-a59d-2271ac3cce68",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "71b30088-a429-442b-8270-a5ae533b4365",
                "_move": "f4b889e6-ea5c-4be0-9daf-e03d9253dd58"
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
            "_uuid": "379a3217-f5ae-4e54-92e2-d21533797831",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "dc89d420-12b2-48bf-b7ca-f175bd2829ba",
                "_move": "880505a1-ad04-497f-bfb5-811667c56d62"
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
            "_uuid": "684aff3b-f723-412e-9f07-d424369d2fe6",
            "_props": {
                "_name": "Toto",
                "_dashes": [],
                "_stand": "7d1920dd-7693-4094-8114-d13e9162324b",
                "_move": "53d8c8ba-6faf-4ddc-91ca-8bce72f57959"
            }
        }
    ]
}

```