const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'Collection model';
module.exports.name = 'collection';
module.exports.tutorialized = true;

module.exports.resolver = (resolve) => {
    const { Collection_Category, Collection_Item } = module.exports.get();
    const item = new Collection_Item({ value: 'foo' });
    const category = new Collection_Category({ items: [item, { value: 'bar' }] });

    _.test(category.items[0].value, 'foo', 'Error on collection accessor with brace');
    _.test(category.items[1].value, 'bar', 'Error on collection accessor with brace');

    let changed = false;
    category.addEventListener('change', () => changed = true);
    category.items[0].value = 'hello';

    if (!changed) {
        throw new Error('Error on collection change event');
    }
    _.test(category.items[0].value, 'hello', 'Error on collection accessor with brace after change');
    _.test(category.items.first.value, 'hello', 'Error on collection method first accessor');

    category.items.push({ value: 'world' });

    _.test(category.items.last.value, 'world', 'Error on collection method last accessor');
    _.test(category.items.map(item => item.value).join(', '), 'hello, bar, world', 'Error on array method map accessor');
    _.test(category.items.filter(item => item.value === 'hello').map(item => item.value).join(', '), 'hello', 'Error on array method filter accessor');
    _.test(category.items.reduce((accu, item) => `${accu} ${item.value}`, '').trim(), 'hello bar world', 'Error on array method reduce accessor');

    category.items.remove(item);
    if (category.items.length !== 2) throw new Error('Error on array method remove accessor');

    resolve(category);
};

module.exports.create = () => {
    const Collection_Item = Fractale.create('Collection_Item', {
        value: String,
    });

    const Collection_Category = Fractale.create('Collection_Category', {
        items: [Collection_Item],
    });

    return { Collection_Category, Collection_Item };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};
module.exports.used = () => {
    return module.exports.get().Collection_Category;
};
