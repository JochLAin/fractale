
const console = require('./console');

const cases = [
    require('./cases/simple'),
    require('./cases/metadata'),
    require('./cases/compound'),
    require('./cases/inception'),
    require('./cases/inception_compound'),
    // require('./cases/complex'),
];

const main = Promise.resolve();

for (let index in cases) {
    main.then(() => {
        return cases[index].promise.then(() => {
            console.log(console.colorize(cases[index].title, 'cyan', null, 'bold'));
            console.log(console.colorize('Test passed\n', 'green'));
        }).catch((error) => {
            console.log(console.colorize(cases[index].title, 'cyan', null, 'bold'));
            console.log(console.colorize('Test error\n', 'red'));
            console.log(`   > ${error.message}`);
            console.log('');
            process.exit(1);
        });
    });
}

main.catch(() => process.exit(2));
