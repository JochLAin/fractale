
const ƒ_type = require('./base');
const types = [
    require('./basic/mixed'),
    require('./basic/boolean'),
    require('./basic/number'),
    require('./basic/string'),
    require('./basic/date'),
    require('./compound/array'),
    require('./evolved/model'),
].sort((a, b) => {
    return b.priority - a.priority;
});

module.exports = ƒ_type;
module.exports.get = () => types;
module.exports.add = (type) => {
    const _typeof = typeof type;
    if (_typeof !== 'function') {
        throw new Error(`Expected class got ${typeof type}(${type})`);
    }
    if (!(type instanceof ƒ_type)) {
        throw new Error(`The type ${type.name} doesn't extend the base property type`);
    }
    if (!type.evaluate) {
        throw new Error(`The type ${type.name} doesn't have an evaluate static method`);
    }
    if (!type.priority) {
        Object.defineProperty(type, 'priority', { value: 0 });
    }
    types.push(type);
    types.sort((a, b) => b.priority - a.priority);
};
