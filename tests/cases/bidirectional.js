const Fractale = require('../../lib');

module.exports.title = 'Bidirectional model';
module.exports.tutorialized = true;

const ModuleSchema = Fractale.createSchema({
    name: String,
    dependents: [Fractale.SELF],
    dependencies: [Fractale.SELF],
});
const Module = Fractale.create('Module', ModuleSchema);

module.exports.resolver = (resolve) => {
    const _uuid = new Module({ name: 'uuid' });
    const _fractale = new Module({ name: 'fractale', dependencies: [_uuid] });

    resolve(_fractale.serialize());
};
