
const Model = require('../factory');
const console = require('./console');

/******************************************************************************************************************/

console.log(console.colorize('Test simple model\n', 'cyan', null, 'bold'));

const Book = Model.create('Book', {
    readable: Boolean,
    title: String,
    nb_chapter: Number
});

const book = new Book({
    title: 'Air gear',
    readable: true,
    nb_chapter: 31
});

console.log(book.title == 'Air gear');
console.log("\n");

/******************************************************************************************************************/

console.log(console.colorize('Test metadata model\n', 'cyan', null, 'bold'));

const Page = Model.create('Page', {
    title: String,
    robot: {
        key: String,
        data: String
    }
});

const page = new Page({ 
    title: 'Hello world',
    robot: {
        key: require('uuid').v4(),
        data: require('uuid').v4()
    }
});

console.log(page.title == 'Hello World');
console.log("\n");

page.robot.key = 'AZERTYUIOP';
console.log(page.robot.key == 'AZERTYUIOP');
console.log("\n");

page.robot = { key: 'QSDFGHJKLM' };
console.log(page.robot.key = 'QSDFGHJKLM');
console.log("\n");

/******************************************************************************************************************/

console.log(console.colorize('Test compound model\n', 'cyan', null, 'bold'));

const Library = Model.create('Library', {
    books: [{
        readable: Boolean,
        title: String,
        nb_chapter: Number
    }]
});

const library = new Library({
    books: [{
        title: 'Air gear',
        readable: true,
        nb_chapter: 31
    }, {
        title: 'Tenjo tenge',
        readable: true,
        nb_chapter: 21
    }]
});

console.log(library.books[0].title == 'Air gear');
console.log("\n");

console.log(library.book(0));
console.log("\n");

/******************************************************************************************************************/

console.log(console.colorize('Test model inception\n', 'cyan', null, 'bold'));

const Message = Model.create('Message', { text: String, priority: Number });
const Messenger = Model.create('Messenger', { message: Message });

const messenger = new Messenger({
    message: {
        text: 'Hello world !'
    }
});

console.log(messenger.message.text);
console.log("\n");

const message = messenger.message;
message.text = 'How are you world ?';
messenger.message = message;
console.log(messenger.message.text);
console.log("\n");

messenger.message.text = 'Good bye world !';
console.log(messenger.message.text);
console.log("\n");

/******************************************************************************************************************/

console.log(console.colorize('Test model array inception\n', 'cyan', null, 'bold'));

const Alert = Model.create('Alert', {
    text: String,
    level: String
});
const Flashbag = Model.create('Flashbag', {
    alerts: [Alert]
});

const flashbag = new Flashbag({
    alerts: [
        { text: 'Hello world !', level: 'info' },
        { text: 'How are you world ?', level: 'warning' },
        { text: 'Good bye world !', level: 'danger' }
    ]
});

console.log(flashbag.serialize());
console.log("\n");

console.log(flashbag.alert(0).serialize());
console.log("\n");

/******************************************************************************************************************/

console.log(console.colorize('Test deeper model array inception\n', 'cyan', null, 'bold'));

const Layer = Model.create('Layer', {
    pixels: [String],
    height: Number,
    width: Number,
});
Layer.prototype.pixel = function (x, y) {
    return this.pixels[y * this.width + x];
};

const Frame = Model.create('Frame', {
    layers: [{ __type: Layer, __options: { through: ['height', 'width']}}],
    height: Number,
    width: Number,
});

const Sprite = Model.create('Sprite', {
    frames: [{ __type: Frame, __options: { through: ['height', 'width']}}],
    height: Number,
    width: Number,
});

const Character = Model.create('Character', {
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

const Game = Model.create('Game', {
    name: String,
    type: String,
    characters: [Character],
});

const sprite = { 
    height: 10,
    width: 10,
    frames: [{
        layers: [{
            pixels: [
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
            ]
        }, {
            pixels: [
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
            ]
        }]
    }]
};

const character = new Character({
    name: 'Toto',
    move: {
        bottom: sprite,
        left: sprite,
        right: sprite,
        top: sprite,
    },
    stand: {
        bottom: sprite,
        left: sprite,
        right: sprite,
        top: sprite,
    },
});

const game = new Game({
    name: 'Blobbi'
});

game.character = character;

// console.log(character, character.move_bottom);
// console.log(game.character(0).move_bottom.frame(0).layer(0).pixel(3));
// console.log(game.character(0).move_bottom.frame(0).layer(0).pixel(3));