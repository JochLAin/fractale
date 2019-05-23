
const { Page } = require('./models');

module.exports.title = 'Test metadata model';

module.exports.run = () => new Promise((resolve) => {
    const page = new Page({
        title: 'Hello world',
        robot: {
            key: require('uuid').v4(),
            data: require('uuid').v4()
        }
    });
    page.robot.key = 'AZERTYUIOP';
    page.robot = { data: 'QSDFGHJKLM' };

    if (page.title !== 'Hello world') {
        throw new Error('Error on simple accessor');
    }
    if (page.robot.key !== 'AZERTYUIOP') {
        throw new Error('Error on metadata accessor with dot');
    }
    if (page.robot_data !== 'QSDFGHJKLM') {
        throw new Error('Error on metadata accessor with bracket');
    }

    if (!page.serialize()) {
        throw new Error('Error on metadata serialize');
    }
    resolve();
});
