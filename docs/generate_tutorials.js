'use strict';

const fs = require('fs');
const path = require('path');

const Fractale = require('../lib');

const KEY_CODE = `\n\n\`\`\`\n\n`;

class Program {
    static cleanCode(code) {
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
    }

    run() {
        const promises = require('../tests').cases.filter(test => {
            if (!test.resolver) return;
            if (!test.tutorialized) return;
            return true;
        }).map(test => {
            const name = test.title.replace(/ /g, '_').toLowerCase();
            return new Promise(test.resolver).then(result => {
                fs.writeFile(
                    path.resolve(__dirname, `tutorials/examples/${name}.md`),
                    this.getContent(test.models, test.resolver.toString(), result),
                    (error) => {
                        if (error) throw error;
                        console.log(`Write "${test.title}" tutorial successfully`);
                    }
                );

                return { name, title: test.title };
            });
        });

        Promise.all(promises).then((values) => {
            fs.writeFileSync(path.resolve(__dirname, 'tutorials/tutorials.json'), JSON.stringify({
                examples: {
                    title: "Examples",
                    children: values.reduce((accu, { name, title }) => {
                        return Object.assign({}, accu, {
                            [name]: { title }
                        });
                    }, {})
                }
            }));
        }).catch(error => {
            throw error;
        });
    }

    getContent(models, code, results) {
        let content = `<article class="mb-4">`;
        content += `<a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a>`;
        content += `<div id="models" class="border border-1 collapse">`;
        content += `${KEY_CODE}${models.map(Model => Fractale.stringify(Model, null, 4))}${KEY_CODE}`;
        content += `</div>`;
        content += `</article>`;
        content += `${KEY_CODE}${Program.cleanCode(code.toString())}${KEY_CODE}`;
        content += `### Results`;
        content += `${KEY_CODE}${JSON.stringify(results, null, 4)}${KEY_CODE}`;

        return content.trim();
    };
}

if (require.main === module) {
    const program = new Program;
    program.run();
}