'use strict';

const Chart = require('chartjs-node');
const _progress = require('cli-progress');
const logger = require('crieur');
const _ = require('../tests/performance');

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
    const height = 10, width = 10;
    for (let character = 10; character <= MAX_CHARACTER; character += 5) {
        for (let dash = 10; dash <= MAX_DASH; dash += 5) {
            for (let frame = 10; frame <= MAX_FRAME; frame += 5) {
                for (let layer = 10; layer <= MAX_LAYER; layer += 5) {
                    params.push(_.run(progress, { character, dash, frame, layer, height, width }, false));
                }
            }
        }
    }
    progress.stop();
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
            const filename = require('path').resolve(__dirname, 'theme/static/images', 'graph_size_x_rate.png');
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
            const filename = require('path').resolve(__dirname, 'theme/static/images', 'graph_complexity_x_rate.png');
            return chart.writeImageToFile('image/png', filename);
        });
    }));

    return Promise.all(promises);
}

const tc = (unit) => (size) => {
    if (![1, 2, 3, 5, 10].includes(size / (10 ** _.log10(size)))) return '';
    return _.log10text(size, unit);
};
