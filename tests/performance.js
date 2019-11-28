'use strict';

const Chart = require('chartjs-node');
const _progress = require('cli-progress');
const logger = require('crieur');
const sizeof = require('object-sizeof');
const Fractale = require('../lib');
const _ = require('./utils');

module.exports.title = 'Performance';
module.exports.name = 'performance';
module.exports.tutorialized = false;

module.exports.run = () => {
    const { Game, Sprite } = module.exports.get();

    // Preload schema
    Sprite.schema.values;
    Game.schema.values;

    let tmp;
    // Local Storage size
    tmp = run( undefined,{ character: 20, dash: 9, frame: 20, layer: 20, height: 2, width: 2 });
    console.log(`From a JSON of ${log10text(tmp.size)}:\nDeserialization: ~${tmp.duration.deserialize}s => ${log10text(tmp.size/tmp.duration.deserialize, 'o/s')}\nRead: ~${tmp.duration.read}s\nSerialization: ~${tmp.duration.serialize}s => ${log10text(tmp.size/tmp.duration.serialize, 'o/s')}\n`);

    // Heavy size
    tmp = run(undefined, { character: 20, dash: 20, frame: 20, layer: 20, height: 10, width: 10 });
    console.log(`From a JSON of ${log10text(tmp.size)}:\nDeserialization: ~${tmp.duration.deserialize}s => ${log10text(tmp.size/tmp.duration.deserialize, 'o/s')}\nRead: ~${tmp.duration.read}s\nSerialization: ~${tmp.duration.serialize}s => ${log10text(tmp.size/tmp.duration.serialize, 'o/s')}\n`);

    // // Huge size
    tmp = run(undefined, { character: 25, dash: 30, frame: 30, layer: 30, height: 10, width: 10 });
    console.log(`From a JSON of ${log10text(tmp.size)}:\nDeserialization: ~${tmp.duration.deserialize}s => ${log10text(tmp.size/tmp.duration.deserialize, 'o/s')}\nRead: ~${tmp.duration.read}s\nSerialization: ~${tmp.duration.serialize}s => ${log10text(tmp.size/tmp.duration.serialize, 'o/s')}\n`);

    if (require.main === module) {
        // Draw graph
        const MAX_CHARACTER = 25, MAX_DASH = 30, MAX_FRAME = 30, MAX_LAYER = 30;
        const TOTAL = (((MAX_CHARACTER - 10) / 5) + 1) * (((MAX_DASH - 10) / 5) + 1) * (((MAX_FRAME - 10) / 5) + 1) * (((MAX_LAYER - 10) / 5) + 1);
        const params = [];
        const progress = new _progress.Bar({
            format: `{text} [{bar}] {percentage}% | {value}/{total} Chunks`,
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        });

        progress.start(TOTAL, 0, { text: 'N/A' });
        const duration = _.watch(() => {
            const height = 10, width = 10;
            for (let character = 10; character <= MAX_CHARACTER; character += 5) {
                for (let dash = 10; dash <= MAX_DASH; dash += 5) {
                    for (let frame = 10; frame <= MAX_FRAME; frame += 5) {
                        for (let layer = 10; layer <= MAX_LAYER; layer += 5) {
                            params.push(run(progress, { character, dash, frame, layer, height, width }, false));
                        }
                    }
                }
            }
        });
        progress.stop();
        logger.info(`Run graph take ${duration}s`);
        params.sort((a, b) => a.size - b.size);

        logger.info('Draw chart');
        const promises = [];
        promises.push(Promise.resolve(new Chart(1900, 1200)).then(chart => {
            const datasets = [{
                label: 'Deserialization',
                xAxisID: 'size',
                yAxisID: 'rate',
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgb(54, 162, 235)',
                fill: false,
                showLine: false,
                pointRadius: 2,
                data: params.map(({ size, duration: { deserialize }}) => ({ x: size, y: Math.round(size / deserialize) })),
            }, {
                label: 'Serialization',
                xAxisID: 'size',
                yAxisID: 'rate',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                fill: false,
                showLine: false,
                pointRadius: 5,
                data: params.map(({ size, duration: { serialize }}) => ({ x: size, y: Math.round(size / serialize) })),
            }];

            const options = {
                responsive: true,
                intersect: true,
                title: {
                    display: true,
                    text: 'Fractale - Performance graph by size',
                },
                scales: {
                    xAxes: [{
                        display: true,
                        type: 'logarithmic',
                        id: 'size',
                        ticks: {callback: tc('o')},
                    }],
                    yAxes: [{
                        display: true,
                        type: 'logarithmic',
                        position: 'left',
                        id: 'rate',
                        ticks: {callback: tc('o/s')},
                    }],
                }
            };

            return chart.drawChart({type: 'line', data: { datasets }, options}).then(() => {
                const filename = require('path').resolve(__dirname, '../docs/theme/static/images', 'graph_size_x_rate.png');
                return chart.writeImageToFile('image/png', filename);
            });
        }));
        promises.push(Promise.resolve(new Chart(1900, 1200)).then(chart => {
            const datasets = [{
                label: 'Deserialization',
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgb(54, 162, 235)',
                fill: false,
                showLine: false,
                pointRadius: 2,
                data: params.map(({ size, duration: { deserialize }}) => Math.round(size / deserialize)),
            }, {
                label: 'Serialization',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                fill: false,
                showLine: false,
                pointRadius: 5,
                data: params.map(({ size, duration: { serialize }}) => Math.round(size / serialize)),
            }];

            const options = {
                responsive: true,
                intersect: true,
                title: {
                    display: true,
                    text: 'Fractale - Performance graph by complexity',
                },
                scales: {
                    yAxes: [{
                        display: true,
                        type: 'logarithmic',
                        position: 'left',
                        id: 'rate',
                        ticks: {callback: tc('o/s')},
                    }],
                }
            };

            return chart.drawChart({type: 'bar', data: { labels: params.map(p => p.complexity), datasets }, options}).then(() => {
                const filename = require('path').resolve(__dirname, '../docs/theme/static/images', 'graph_complexity_x_rate.png');
                return chart.writeImageToFile('image/png', filename);
            });
        }));

        return Promise.all(promises);
    }
};

module.exports.create = () => {
    const Sprite = Fractale.create('Sprite', {
        frames: [Fractale.with({
            layers: [Fractale.with({
                pixels: [String],
                height: Number,
                width: Number,
            }, { through: ['height', 'width']})],
            height: Number,
            width: Number
        }, { through: ['height', 'width']})],
        height: Number,
        width: Number,
    });

    const Game = Fractale.create('Game', {
        name: String,
        type: String,
        characters: [{
            name: String,
            preview: Sprite,
            portrait: Sprite,
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
        }],
    });

    return { Game, Sprite };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};

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

const run = (progress, options = {}) => {
    const { Game } = module.exports.get();
    const params = Object.assign({
        length: Object.assign( {
            character: 1,
            dash: 1,
            frame: 1,
            layer: 1,
            pixel: 1,
            height: 1,
            width: 1,
        }, options),
        count: {},
        duration: {},
    });
    const nb_character = params.length.character;
    const nb_sprite = nb_character * (10 + (params.length.dash));
    const nb_frame = nb_sprite * (params.length.frame);
    const nb_layer = nb_frame * (params.length.layer);
    const nb_pixels = nb_layer * params.length.height * params.length.width;

    Object.assign(params, {
        complexity: `${params.length.character}x${(10 + params.length.dash)}x${params.length.frame}x${params.length.layer}x${params.length.height * params.length.width}`,
        count: {
            character: nb_character,
            sprite: nb_sprite,
            frame: nb_frame,
            layer: nb_layer,
            pixel: nb_pixels,
        },
    });

    const _game = create('mmo', params);
    const size = sizeof(_game);
    Object.assign(params, { size });
    if (progress) {
        progress.increment(1, { text: `${params.complexity} (${log10text(size, 'o')})` });
    }

    let game;
    params.duration.deserialize = _.watch(() => {
        game = new Game(_game);
    });

    params.duration.read = _.watch(() => {
        const character_idx = getRandom(params.length.character);
        const frame_idx = getRandom(params.length.frame);
        const layer_idx = getRandom(params.length.layer);
        const pixels = game.characters[character_idx].move.bottom.frames[frame_idx].layers[layer_idx].pixels;
        if (pixels.length >= 4) {
            _.test(pixels[3], '#000333', 'Error on huge accessor');
        }
    });

    params.duration.serialize = _.watch(() => {
        if (!game.serialize()) {
            throw new Error('Error on huge serialize');
        }
    });

    Fractale.memory.clear();
    return params;
};

const create = (name, params) => {
    const LAYER = (idx) => ({
        pixels: PIXELS.slice(0, params.length.height * params.length.width),
    });

    const FRAME = (idx) => ({
        layers: [...Array(params.length.layer)].map((x, idx) => LAYER(idx)),
    });

    const SPRITE = (idx) => ({
        height: params.length.height,
        width: params.length.width,
        frames: [...Array(params.length.frame)].map((x, idx) => FRAME(idx)),
    });

    const CHARACTER = (idx) => ({
        name: `Character ${idx}`,
        dashes: [...Array(params.length.dash)].map((x, idx) => SPRITE(idx)),
        portrait: SPRITE(),
        preview: SPRITE(),
        move: {
            bottom: SPRITE(),
            left: SPRITE(),
            right: SPRITE(),
            top: SPRITE(),
        },
        stand: {
            bottom: SPRITE(),
            left: SPRITE(),
            right: SPRITE(),
            top: SPRITE(),
        },
    });

    return {
        name: `Game ${name}`,
        type: `Type ${name}`,
        characters: [...Array(params.length.character)].map((x, idx) => CHARACTER(idx)),
    };
};

const getRandom = (max) => {
    return Math.floor(Math.random() * max);
};

const log10 = (size) => {
    if (size === Infinity) return 8 * 3 + 2;
    let pow = 0;
    if (size <= 1) {
        while (size * (10 ** -pow) > -10) {
            pow--;
        }
    } else {
        while (size / (10 ** pow) > 10) {
            pow++;
        }
    }
    return pow;
};

const log10text = (size, unit = '') => {
    const prefix = (pow) => {
        if (size === Infinity) return 999.99;
        return Math.round(size / (10 ** (Math.floor(pow / 3) * 3)) * 100) / 100;
    };

    const suffix = (pow) => {
        switch (Math.floor(pow / 3)) {
            case -8: return 'y';
            case -7: return 'z';
            case -6: return 'a';
            case -5: return 'f';
            case -4: return 'p';
            case -3: return 'n';
            case -2: return 'µ';
            case -1: return 'm';
            case 0: return '';
            case 1: return 'k';
            case 2: return 'M';
            case 3: return 'G';
            case 4: return 'T';
            case 5: return 'P';
            case 6: return 'E';
            case 7: return 'Z';
            case 8: return 'Y';
        }
        return '';
    };

    const pow = log10(size);
    return `${prefix(pow)}${suffix(pow)}${unit}`;
};

const tc = (unit) => (size) => {
    if (![1, 2, 3, 5, 10].includes(size / (10 ** log10(size)))) return '';
    return log10text(size, unit);
};

if (require.main === module) {
    module.exports.run();
}
