'use strict';

const fs = require('fs');
const path = require('path');

const Fractale = require('../lib');
const { cases } = require('../tests');
const keys = [];

for (let index in cases) {
    const test = cases[index];
    if (!test.resolver) continue;
    if (!test.tutorialized) continue;

    const dependencies = `<article class="mb-4">
<a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a>
<div id="models" class="border border-1 collapse">

\`\`\`
${test.models.map(Model => Fractale.stringify(Model, null, 4))}
\`\`\`

</div>
</article>`;

    const name = test.title.replace(/ /g, '_').toLowerCase();
    const resolver = test.resolver.toString();
    const code = resolver
        .slice(resolver.indexOf('{') +1, resolver.lastIndexOf('}'))
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

    const content = `\`\`\`\n${code}\n\`\`\``;
    const body = dependencies + '\n\n' + content;
    fs.writeFileSync(path.resolve(__dirname, `tutorials/examples/${name}.md`), body.trim());

    console.log(`Write "${test.title}" tutorial successfully`);
    keys.push({ name, title: test.title });
}

fs.writeFileSync(path.resolve(__dirname, 'tutorials/tutorials.json'), JSON.stringify({
    examples: {
        title: "Examples",
        children: keys.reduce((accu, item) => {
            return Object.assign({}, accu, {
                [`${item.name}`]: { title: item.title }
            });
        }, {})
    }
}));
