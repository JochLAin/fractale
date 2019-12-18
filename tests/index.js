const logger = require('crieur');
const Fractale = require('../lib');

Fractale.library.on('add', ({ name }) => {
    logger.debug(`Create model ${name}`);
});

if (process.env.LOG_LEVEL) {
    logger.level = process.env.LOG_LEVEL;
}

module.exports.run = () => {
    const cases = Array.from(module.exports.cases);
    const chain = Promise.resolve();
    const loop = () => Promise.resolve().then(() => {
        const test = cases.shift();
        if (test) {
            logger.info(`  > ${test.title}`, { bold: true });
            const promise = new Promise(test.resolver);
            return promise.then(() => {
                logger.success('Test passed !', { block: true });
                // Fractale.memory.clear();
            }).then(() => {
                return loop();
            });
        }
    });

    return chain.then(loop).then(() => {
        try {
            const w = window;
        } catch (error) {
            logger.info(`  > Performance`, { bold: true });
            require('./performance').run();
        }
    });
};

module.exports.cases = [
    require('./event_listener'),
    require('./cases/simple'),
    require('./cases/inception'),
    require('./cases/metadata'),
    require('./cases/collection'),
    require('./cases/self_reference'),
    require('./cases/inheritance'),
    require('./cases/form'),
    require('./cases/regexp'),
    require('./cases/complex'),
    require('./cases/deep'),
    require('./cases/serializer'),
    require('./cases/validator'),
    require('./cases/options/global'),
    require('./cases/error'),
    require('./cases/static'),
    require('./cases/stringify'),
    // require('./cases/bridge'),
];

if (require.main === module) {
    module.exports.run().catch((error) => {
        logger.error('Test failed !', { block: true });
        logger.error(error);

        process.exit(1);
    });
}
