'use strict';

const js2md = require('jsdoc-to-markdown');
const logger = require('crieur');
const path = require('path');
const fs = require('./utils/filesystem');

module.exports.run = () => {
    // const files = fs.find(path.resolve(__dirname, '../lib'), '*.js').split('\n').slice(0, -1);
    const files = [
        path.resolve(__dirname, '../lib', 'index.js'),
        path.resolve(__dirname, '../lib', 'factory.js'),
        path.resolve(__dirname, '../lib', 'library.js'),
        path.resolve(__dirname, '../lib', 'options.js'),
        path.resolve(__dirname, '../lib', 'property/schema.js'),
        path.resolve(__dirname, '../lib', 'property/index.js'),
        path.resolve(__dirname, '../lib', 'property/types/index.js'),
        path.resolve(__dirname, '../lib', 'property/types/array/index.js'),
        path.resolve(__dirname, '../lib', 'memory/index.js'),
        path.resolve(__dirname, '../lib', 'memory/table.js'),
        path.resolve(__dirname, '../lib', 'memory/providers/index.js'),
        path.resolve(__dirname, '../lib', 'memory/providers/internal.js'),
        path.resolve(__dirname, '../lib', 'memory/providers/local.js'),
        path.resolve(__dirname, '../lib', 'memory/providers/session.js'),
        path.resolve(__dirname, '../lib', 'memory/providers/cookie.js'),
        path.resolve(__dirname, '../lib', 'memory/providers/idb.js'),
        path.resolve(__dirname, '../lib', 'bridges/index.js'),
        path.resolve(__dirname, '../lib', 'bridges/mongoose.js'),
        path.resolve(__dirname, '../lib', 'bridges/prop_types.js'),
    ];
    return js2md.getTemplateData({ files, configure: path.resolve(__dirname, '..', 'jsdoc.json') }).then((data) => {
        fs.remove(path.resolve(__dirname, '../wiki', 'docs/api/*'));
        fs.write(path.resolve(__dirname, 'docs.json'), JSON.stringify(data, null, 3));
        return Promise.all(data.reduce((accu, item) => {
            if (item.kind === 'module' && item.name === 'Fractale') accu.push(item);
            else if (item.kind === 'class') accu.push(item);
            return accu;
        }, []).sort((a, b) => {
            if (a.kind === 'module' && b.kind === 'class') return -1;
            if (a.kind === 'class' && b.kind === 'module') return 1;
            if (a.augments && a.augments.includes('Error')) return 1;
            if (b.augments && b.augments.includes('Error')) return -1;
            const posA = files.indexOf(path.resolve(a.meta.path, a.meta.filename));
            const posB = files.indexOf(path.resolve(b.meta.path, b.meta.filename));
            return (posA - posB) > 0 ? 1 : -1;
        }).map((item) => {
            logger.debug(`Generate documentation for ${item.name}`);
            const template = `{{#${item.kind} name="${item.name}"}}{{>docs}}{{/${item.kind}}}`;
            return js2md.render({ data, template, plugin: 'dmd-bitbucket' }).then((content) => {
                fs.write(path.resolve(__dirname, '../wiki/docs/api', `${item.name.toLowerCase()}.md`), content);
                return item;
            });
        }));
    }).then((items) => {
        logger.info('Update documentation in summary');
        const summary = require('./summary.json');
        const index = summary.children.findIndex(child => child.title === 'API Documentation');
        summary.children[index].children = items.map(item => ({
            title: item.name,
            url: `api/${item.name.toLowerCase()}`,
            file: `api/${item.name.toLowerCase()}.md`
        }));
        fs.write(
            path.resolve(__dirname, 'summary.json'),
            JSON.stringify(summary, null, 3)
        );
    });
};

if (require.main === module) {
    module.exports.run().catch(error => {
        logger.error('Test failed !', { block: true });
        logger.error(error);

        process.exit(1);
    });
}
