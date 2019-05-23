
const { Page } = require('./models');

module.exports.title = 'Test metadata model';

module.exports.run = () => new Promise((resolve) => {
    const page = new Page({
        title: 'Hello world',
        robot: {
            key: require('uuid').v4(),
            data: {
                key: require('uuid').v4(),
                value: require('uuid').v4(),
            }
        }
    });

    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');

    page.robot.key = 'AZERTYUIOP';
    page.robot = { data: { key: 'QSDFGHJKLM', value: 'efopwkwe' } };

    console.log('');
    console.log('');
    console.log('');
    console.log(page);
    console.log(page.robot);
    console.log(page.robot.key);
    console.log(page.robot.data.key);

    if (page.title !== 'Hello world') {
        throw new Error('Error on simple accessor');
    }
    if (page.robot.key !== 'AZERTYUIOP') {
        throw new Error('Error on metadata accessor with dot');
    }
    if (page.robot_data.key !== 'QSDFGHJKLM') {
        throw new Error('Error on metadata accessor with bracket');
    }

    if (!page.serialize()) {
        throw new Error('Error on metadata serialize');
    }
    resolve();
});
