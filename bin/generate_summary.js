'use strict';

const logger = require('crieur');
const path = require('path');
const fs = require('./utils/filesystem');

module.exports.run = () => {
    return Promise.resolve(require('./summary.json')).then((summary) => {
        logger.info('Generate summary for gitbook');
        const closure = (group, level = 1) => {
            if (group.children) {
                return `\n${Array(level).fill('#').join('')} ${group.title}\n\n${group.children.map(child => closure(child, level + 1)).join('\n')}\n`;
            }
            return `* [${group.title}](${group.url})`;
        };
        const content = closure(summary).trim();
        fs.write(path.resolve(__dirname, '../wiki/docs', 'SUMMARY.md'), content);
        return summary;
    }).then((summary) => {
        logger.info('Generate summary for github wiki');
        const closure = (group, level = 1) => {
            if (group.children) {
                return `\n${Array(level).fill('#').join('')} ${group.title}\n\n${group.children.map(child => closure(child, level + 1)).join('\n')}`;
            }
            return `* [${group.title}](https://github.com/JochLAin/fractale/wiki/docs/${group.url})`;
        };
        const content = closure(summary).trim();
        fs.write(path.resolve(__dirname, '../wiki', '_Sidebar.md'), content);
        return summary;
    });
};

if (require.main === module) {
    module.exports.run().catch(error => {
        logger.error('Test failed !', { block: true });
        logger.error(error);

        process.exit(1);
    });
}
