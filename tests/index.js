const logger = require('crieur');
const console = require('./console');
module.exports.models = require('./models');

const cases = module.exports.cases = [
    require('./cases/simple'),
    require('./cases/inheritance'),
    require('./cases/metadata'),
    require('./cases/inception'),
    require('./cases/collection'),
    require('./cases/self_reference'),
    require('./cases/form'),
    require('./cases/deep'),
    require('./cases/complex'),
    require('./cases/stringify'),
    // require('./cases/huge'),
    // require('./cases/deeper'),
];

if (require.main === module) {
    const chain = Promise.resolve();

    const loop = async () => {
        let current = cases.shift();
        if (current) {
            console.log(console.colorize(`  > ${current.title}`, 'blue', null, 'bold'));

            await (new Promise(current.resolver)).then(() => {
                console.log('');
                console.log(console.colorize('\n  Test passed\n', 'white', 'green'));
                console.log('');
            }).catch((error) => {
                console.log('');
                console.log(console.colorize('\n  Test error\n', 'white', 'red'));
                console.log('');
                logger.error(error);
                console.log('');
                process.exit(1);
            });

            return loop();
        }
    };

    chain.then(loop).catch(() => process.exit(1));
}
