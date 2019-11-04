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

            // library.names.map((slug) => {
            //     const encyclopedia = library.get(slug);
            //     logger.debug(` * ${encyclopedia.name}\n`);
            //
            //     const table = new Table({ head: ['uuid'].concat(Object.keys(encyclopedia.schema)), style: { head: ['blue'] } });
            //     for (const index in encyclopedia.memory.data) {
            //         const item = encyclopedia.memory.data[index];
            //         const line = Object.keys(encyclopedia.schema).reduce((accu, key) => {
            //             return accu.concat(Array.isArray(item[key]) ? item[key].join(', ') : item[key]);
            //         }, [item.uuid]);
            //         table.push(line);
            //     }
            //     console.log(table.toString(), '\n');
            // });

            process.exit(1);
        });

        return loop();
    }
};

chain.then(loop).catch(() => process.exit(1));
