
const console = require('./console');

const cases = [
    require('./cases/simple'),
    require('./cases/metadata'),
    require('./cases/inception'),
    require('./cases/collection'),
    require('./cases/self_reference'),
    require('./cases/deep'),
    require('./cases/complex'),
    // require('./cases/huge'),
    // require('./cases/deeper'),
];

const chain = Promise.resolve();

const loop = async () => {
    let current = cases.shift();
    if (current) {
        console.log(console.colorize(`  > ${current.title}`, 'blue', null, 'bold'));

        await current.run().then(() => {
            console.log('');
            console.log(console.colorize('\n  Test passed\n', 'white', 'green'));
            console.log('');
        }).catch((error) => {
            console.log('');
            console.log(console.colorize('\n  Test error\n', 'white', 'red'));
            console.log('');
            console.error(error);
            console.log('');
            process.exit(1);
        });

        return loop();
    }
};

chain.then(loop).catch(() => process.exit(1));
