const MixedPropertyDefiner = require('./mixed');

module.exports = class ModelPropertyDefiner extends MixedPropertyDefiner {
    static get(property) {
        const value = property.denormalize(property.value);
        if (!value) return;
        const props = property.field.value.memory.read(value);
        if (property.options.through) {
            for (let index in property.options.through) {
                if (property.options.through.hasOwnProperty(index)) {
                    const key = property.options.through[index];
                    props[key] = property.instance.get(key);
                }
            }
        }
        if (!props) return;
        const item = new property.field.value.proxy(props);
        item.on('change', ({ key, previous, value }) => {
            property.instance.emit('change', {
                key: `${property.key}.${key}`,
                previous,
                value
            });
        });
        return item;
    }
};
