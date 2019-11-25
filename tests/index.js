const logger = require('crieur');

if (process.env.LOG_LEVEL) {
    logger.level = process.env.LOG_LEVEL;
}

module.exports.run = () => {
    const cases = Array.from(module.exports.cases);
    const chain = Promise.resolve();
    const loop = () => Promise.resolve().then(() => {
        let current = cases.shift();
        if (current) {
            logger.info(`  > ${current.title}`, { bold: true });
            const promise = new Promise(current.resolver);
            return promise.then(() => {
                logger.success('Test passed !', { block: true });
            }).then(() => {
                return loop();
            });
        }
    });

    return chain.then(loop).then(() => {
       require('./performance').run();
    });
};

module.exports.models = require('./models');
module.exports.cases = [
    require('./event_listener'),
    require('./cases/simple'),
    require('./cases/inception'),
    require('./cases/metadata'),
    require('./cases/collection'),
    require('./cases/self_reference'),
    require('./cases/regexp'),
    require('./cases/inheritance'),
    require('./cases/form'),
    require('./cases/complex'),
    require('./cases/deep'),
    require('./cases/error'),
    require('./cases/serializer'),
    require('./cases/validator'),
    require('./cases/static'),
    require('./cases/stringify'),
];

if (require.main === module) {
    module.exports.run().catch((error) => {
        logger.error('Test failed !', { block: true });
        logger.error(error);

        process.exit(1);
    });
}
