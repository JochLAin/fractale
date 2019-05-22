
const Model = require('../../factory');

module.exports.title = 'Test metadata model'

module.exports.run = () => new Promise((resolve, reject) => {
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
    page.robot.key = 'AZERTYUIOP';
    page.robot = { data: 'QSDFGHJKLM' };

    if (page.title !== 'Hello world') {
        console.log(page.title, 'Hello world');
        return reject(new Error('Error on simple accessor'));
    }
    if (page.robot.key !== 'AZERTYUIOP') {
        console.log(page.robot.key, 'AZERTYUIOP');
        return reject(new Error('Error on metadata accessor with dot'));
    }
    if (page.robot_data !== 'QSDFGHJKLM') {
        console.log(page.robot.data, 'QSDFGHJKLM');
        return reject(new Error('Error on metadata accessor with bracket'));
    }

    if (!page.serialize()) {
        return reject(new Error('Error on metadata serialize'));
    }
    resolve();
});
