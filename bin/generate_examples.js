'use strict';

const logger = require('crieur');
const path = require('path');
const Fractale = require('../lib');
const Test = require('../tests');
const fs = require('./utils/filesystem');

const KEY_CODE_JAVASCRIPT = `\n\n\`\`\`javascript\n`;
const KEY_CODE_JSON = `\n\n\`\`\`json\n`;
const KEY_CODE = `\n\`\`\`\n\n`;

module.exports.clean = (code) => {
    return code
        .slice(code.indexOf('{') +1, code.lastIndexOf('}'))
        .split('\n')
        .map(line => {
            return line
                .replace(/    /g, '\t')
                .replace(/^\t/g, '')
                .replace(/\t/g, '    ')
                ;
        })
        .join('\n')
        .trim()
    ;
};

module.exports.format = (test, results) => {
    logger.info(`Format ${test.title}`);
    let content = `<article class="mb-4">`;
    content += `<a href="#models" class="border border-1 d-block p-2" data-toggle="collapse">See models used for examples</a>`;
    content += `<div id="models" class="collapse">`;
    content += `${KEY_CODE_JAVASCRIPT}${Fractale.stringify(test.used(), { space: 4, dependencies: true })}${KEY_CODE}`;
    content += `</div>`;
    content += `</article>`;
    content += `${KEY_CODE_JAVASCRIPT}${module.exports.clean(test.resolver.toString())}${KEY_CODE}`;
    content += `### Results`;
    content += `${KEY_CODE_JSON}${JSON.stringify(results, (key, value) => typeof value === 'bigint' ? value.toString() : value, 4)}${KEY_CODE}`;

    return content.trim();
};

module.exports.get = () => {
    return Test.cases.filter(test => {
        if (!test.resolver) return;
        if (!test.tutorialized) return;
        return true;
    }).map((test) => {
        return new Promise(test.resolver).then(result => {
            const content = module.exports.format(test, result.serialize());
            return Object.assign(test, { content });
        }, (error) => {
            logger.error(error);
            process.exit(1);
        });
    });
};

module.exports.run = () => {
    const promises = module.exports.get();
    return Promise.all(promises).then((tests) => {
        // Write example list
        fs.write(path.resolve(__dirname, '../docs', 'examples.json'), tests);
    }, (error) => {
        logger.error(error);
        process.exit(1);
    });
};

if (require.main === module) {
    module.exports.run().catch(error => {
        logger.error('Test failed !', { block: true });
        logger.error(error);

        process.exit(1);
    });
}
