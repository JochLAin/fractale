'use strict';

const logger = require('crieur');
const path = require('path');
const Fractale = require('../lib');
const Test = require('../tests');
const fs = require('./filesystem');

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
    let content = `<article class="mb-4">`;
    content += `<a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a>`;
    content += `<div id="models" class="border border-1 collapse">`;
    content += `${KEY_CODE_JAVASCRIPT}${test.models.map(model => Fractale.stringify(model, { space: 4, dependencies: true }))}${KEY_CODE}`;
    content += `</div>`;
    content += `</article>`;
    content += `${KEY_CODE_JAVASCRIPT}${module.exports.clean(test.resolver.toString())}${KEY_CODE}`;
    content += `### Results`;
    content += `${KEY_CODE_JSON}${JSON.stringify(results, null, 4)}${KEY_CODE}`;

    return content.trim();
};

module.exports.get = () => {
    return Test.cases.filter(test => {
        if (!test.resolver) return;
        if (!test.tutorialized) return;
        return true;
    }).map((test, index) => {
        return new Promise(test.resolver).then(result => {
            const name = `${index + 1}-${test.name}`;
            const content = module.exports.format(test, result.serialize());
            const filename = path.resolve(__dirname, `tutorials/examples/${name}.md`);
            return Object.assign(test, { content, name, filename });
        }, (error) => {
            logger.error(error);
            process.exit(1);
        });
    });
};

module.exports.run = () => {
    const promises = module.exports.get();
    return Promise.all(promises).then((tests) => {
        // Clean examples folder
        logger.info('Clean examples folder');
        fs.remove(path.resolve(__dirname, 'tutorials/examples/*'));

        for (const index in tests) {
            logger.info(`Write "${tests[index].title}"`);
            fs.write(tests[index].filename, tests[index].content);
        }

        // Update example list
        const content = fs.read(path.resolve(__dirname, 'tutorials/tutorials.json')) || {};
        Object.assign(content, {
            examples: {
                title: "Examples",
                children: tests.reduce((accu, test, index) => {
                    return Object.assign({}, accu, {
                        [test.name]: {
                            title: `Example ${index + 1}: ${test.title}`,
                        },
                    });
                }, {})
            }
        });

        // Write example list
        fs.write(path.resolve(__dirname, 'tutorials/tutorials.json'), content);
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
