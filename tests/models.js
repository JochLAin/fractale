const Fractale = require('../lib');

const Simple = module.exports.Simple = Fractale.create('Simple', {
    mixed: null || undefined,
    boolean: Boolean,
    number: Number,
    string: String,
});

const Compound = module.exports.Compound = Fractale.create('Compound', Simple, {
    boards: [String],
    metadata: { key: String, data: { key: String, value: null }},
    collections: [{ key: String, value: String }],
});

const Page = module.exports.Page = Fractale.create('Page', {
    title: String,
    content: String,
});

const Chapter = module.exports.Chapter = Fractale.create('Chapter', {
    pages: [Page],
});

const Author = module.exports.Author = Fractale.create('Author', {
    firstname: String,
    lastname: String,
    surname: String,
    comment: String,
});

const Book = module.exports.Book = Fractale.create('Book', {
    author: Author,
    readable: Boolean,
    title: String,
    chapters: [Chapter]
});

const Library = module.exports.Library = Fractale.create('Library', {
    books: [Book]
});

const Variable = module.exports.Variable = Fractale.create('Variable', {
    name: String,
    value: null,
    static: Boolean,
    scope: Fractale.with(String, { values: ['private', 'protected', 'public'] })
});

const Method = module.exports.Method = Fractale.create('Method', {
    signature: {
        name: String,
        properties: [Variable]
    },
    body: String,
});

const Class = module.exports.Class = Fractale.create('Class', {
    name: String,
    inheritance: Fractale.SELF,
    variables: Variable,
    methods: [Method]
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
    layers: [{ __type: Layer, __options: { through: ['height', 'width']}}],
    height: Number,
    width: Number,
});

const Sprite = module.exports.Sprite = Fractale.create('Sprite', {
    frames: [{ __type: Frame, __options: { through: ['height', 'width']}}],
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
