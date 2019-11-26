'use strict';

const _ = require('../tests/utils');

module.exports.deserialize = (entity, data) => {
    if (typeof data !== 'object') {
        throw new Error('Deserializer has not correct data to deserialize');
    }

    for (let index = 0, fields = entity.schema.values, length = fields.length; index < length; index++) {
        const field = fields[index];
        if (field.ƒ_regexp) {
            for (let idx = 0, keys = Object.keys(data), length = keys.length; idx < length; idx++) {
                if (!keys[idx].match(field.key)) continue;
                if (!data[field.key]) data[field.key] = {};
                data[field.key][keys[idx]] = data[keys[idx]];
                delete data[keys[idx]];
            }
        }
        if (!data.hasOwnProperty(field.key)) continue;
        field.validate(data[field.key]);
        Object.assign(data, {
            [field.key]: field.normalize(data[field.key]),
        });
    }
    return data;
};

module.exports.query = (values, params = {}) => {
    const { columns, filters, limit, offset, sorts, group } = params;
    const results = values.filter((item) => {
        if (!filters) return true;
        for (let key in filters) {
            if (filters.hasOwnProperty(key)) {
                if (item[key] !== filters[key]) {
                    return false;
                }
            }
        }
        return true;
    }).sort((a, b) => {
        if (!sorts) return 0;
        for (let key in sorts) {
            if (sorts.hasOwnProperty(key)) {
                if (sorts[key] === 'DESC') {
                    if (a[key] < b[key]) return -1;
                    if (a[key] > b[key]) return 1;
                } else {
                    if (a[key] > b[key]) return -1;
                    if (a[key] < b[key]) return 1;
                }
            }
        }
    }).map((item) => {
        if (!columns) return item;
        return Object.keys(item).filter(key => columns.includes(key)).reduce((accu, key) => {
            return Object.assign({}, accu, { [key]: item[key] });
        }, {});
    });

    return results.slice(offset, limit || results.length).reduce((accu, item) => {
        if (!group || !group.length) return [].concat(accu || [], item);
        if (Array.isArray(accu)) accu = {};
        (accu[item[group]] = accu[item[group]] || []).push(item);
        return accu;
    }, []);
};

module.exports.toPascalCase = (text) => {
    return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
};
