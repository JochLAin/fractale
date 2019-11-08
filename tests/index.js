const logger = require('crieur');
module.exports.models = require('./models');

const cases = module.exports.cases = [
    require('./cases/simple'),
    require('./cases/metadata'),
    require('./cases/inheritance'),
    require('./cases/inception'),
    require('./cases/collection'),
    require('./cases/self_reference'),
    require('./cases/form'),
    require('./cases/deep'),
    require('./cases/complex'),
    require('./cases/stringify'),
];

const chain = Promise.resolve();

const loop = async () => {
    let current = cases.shift();
    if (current) {
        logger.info(`  > ${current.title}`, { bold: true });

        await (new Promise(current.resolver)).then(() => {
            logger.success('Test passed !', { block: true });
        }).catch((error) => {
            logger.error('Test failed !', { block: true });
            logger.error(error);
            process.exit(0);
        });

        return loop();
    }
};

chain.then(loop).catch(() => process.exit(1));
