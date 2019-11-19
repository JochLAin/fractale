const logger = require('crieur');

if (process.env.LOG_LEVEL) {
    logger.level = process.env.LOG_LEVEL;
}

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

module.exports.run = () => chain.then(loop);
module.exports.models = require('./models');
const cases = module.exports.cases = [
    require('./event_listener'),
    require('./cases/error'),
    require('./cases/simple'),
    require('./cases/validator'),
    require('./cases/metadata'),
    require('./cases/inception'),
    require('./cases/collection'),
    require('./cases/self_reference'),
    require('./cases/inheritance'),
    require('./cases/form'),
    require('./cases/complex'),
    require('./cases/deep'),
    require('./cases/static'),
    require('./cases/huge'),
    require('./cases/stringify'),
];

if (require.main === module) {
    module.exports.run().catch((error) => {
        logger.error('Test failed !', { block: true });
        logger.error(error);

        process.exit(1);
    });
}
