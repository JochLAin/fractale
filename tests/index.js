
const console = require('./console');

const cases = [
    require('./cases/simple'),
    require('./cases/metadata'),
    require('./cases/compound'),
    require('./cases/inception'),
    require('./cases/inception_compound'),
    require('./cases/complex'),
];

const chain = Promise.resolve();

const loop = async () => {
    let current = cases.shift();
    if (current) {
        console.log(console.colorize(current.title, 'cyan', null, 'bold'));

        await current.run().then(() => {
            console.log(console.colorize('Test passed\n', 'green'));
        }).catch((error) => {
            console.log(console.colorize('Test error\n', 'red'));
            console.log(console.colorize(`\n  ${error.message}\n`, 'white', 'red'));
            console.log('');
            process.exit(1);
        });

        return loop();
    }
};

chain.then(loop).catch(() => process.exit(1));
