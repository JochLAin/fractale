const logger = require('crieur');
// module.exports.models = require('./models');
if (process.env.LOG_LEVEL) {
    logger.level = process.env.LOG_LEVEL;
}

const cases = module.exports.cases = [
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
        }).catch((error) => {
            logger.error('Test failed !', { block: true });
            logger.error(error);
            process.exit(0);
        });
    }
});

chain.then(loop).catch((error) => {
    logger.error(error);
    process.exit(0);
});
