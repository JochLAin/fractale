
const { Page } = require('./models');
const console = require('../console');

module.exports.title = 'Test metadata model';

module.exports.run = () => new Promise((resolve) => {
    const page = new Page({
        title: 'Hello world',
        robot: {
            key: 'before',
            data: {
                key: 'before',
                value: 'before',
            }
        }
    });

    const robot = page.robot;
    robot.key = 'decomposition';

    if (page.robot.key !== 'decomposition') {
        throw new Error('Error on metadata accessor with decomposition');
    }

    page.robot.key = 'dot';
    if (page.robot.key !== 'dot') {
        throw new Error('Error on metadata accessor with dot');
    }

    page.robot = { key: 'assign' };
    if (page.robot.key !== 'assign') {
        throw new Error('Error on metadata accessor with assign');
    }

    page.robot = { data: { key: 'after', value: 'after' } };

    if (page.robot.key !== 'assign') {
        throw new Error('Error on metadata accessor with bracket');
    }
    if (page.robot.data.key !== 'after') {
        throw new Error('Error on metadata accessor with bracket');
    }

    if (!page.serialize()) {
        throw new Error('Error on metadata serialize');
    }
    resolve();
});
