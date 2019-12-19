'use strict';

const logger = require('crieur');
const path = require('path');
const fs = require('./utils/filesystem');

module.exports.run = () => {
    return new Promise((resolve) => {
        const closure = (group, level = 1) => {
            if (group.children) {
                return `\n${Array(level).fill('#').join('')} ${group.title}\n\n${group.children.map(child => closure(child, level + 1)).join('\n')}\n`;
            }
            return `* [${group.title}](${group.url})`;
        };
        const summary = require('./summary.json');
        const content = closure(summary).trim();
        fs.write(path.resolve(__dirname, '../docs', 'SUMMARY.md'), content);
        resolve();
    });
};

if (require.main === module) {
    module.exports.run().catch(error => {
        logger.error('Test failed !', { block: true });
        logger.error(error);

        process.exit(1);
    });
}
