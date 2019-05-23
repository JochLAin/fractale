
const Fractale = require('../../factory');

const Page = module.exports.Page = Fractale.create('Page', {
    title: String,
    robot: {
        key: String,
        data: String
    }
});

const Book = module.exports.Book = Fractale.create('Book', {
    readable: Boolean,
    title: String,
    nb_chapter: Number
});

const Library = module.exports.Library = Fractale.create('Library', {
    books: [{
        readable: Boolean,
        title: String,
        nb_chapter: Number
    }]
});

const Message = module.exports.Message = Fractale.create('Message', {
    text: String,
    priority: Number
});

const Messenger = module.exports.Messenger = Fractale.create('Messenger', {
    message: Message
});

const Alert = module.exports.Alert = Fractale.create('Alert', {
    text: String,
    level: String
});

const Flashbag = module.exports.Flashbag = Fractale.create('Flashbag', {
    alerts: [Alert]
});

const Variable = module.exports.Variable = Fractale.create('Variable', {
    name: String,
    value: undefined,
    static: Boolean,
    scope: Fractale.with(String, { values: ['private', 'protected', 'public'] })
});

const Class = module.exports.Class = Fractale.create('Class', {
    name: String,
    inheritance: Fractale.SELF,
    variables: Variable,
    methods: [{
        signature: {
            name: String,
            properties: [Variable]
        },
        body: String,
    }]
});

const Program = module.exports.Program = Fractale.create('Program', {
    uses: [Class],
    class: Class
});


const Layer = module.exports.Layer = Fractale.create('Layer', {
    pixels: [String],
    height: Number,
    width: Number,
});
Layer.prototype.pixel = function (x, y) {
    return this.pixels[y * this.width + x];
};

const Frame = module.exports.Frame = Fractale.create('Frame', {
    layers: [Fractale.with(Layer, { through: ['height', 'width']})],
    height: Number,
    width: Number,
});

const Sprite = module.exports.Sprite = Fractale.create('Sprite', {
    layers: [Fractale.with(Frame, { through: ['height', 'width']})],
    height: Number,
    width: Number,
});

const Character = module.exports.Character = Fractale.create('Character', {
    name: String,
    preview: Sprite,
    dashes: [Sprite],
    stand: {
        bottom: Sprite,
        left: Sprite,
        right: Sprite,
        top: Sprite,
    },
    move: {
        bottom: Sprite,
        left: Sprite,
        right: Sprite,
        top: Sprite,
    },
});

const Game = module.exports.Game = Fractale.create('Game', {
    name: String,
    type: String,
    characters: [Character],
});