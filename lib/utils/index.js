module.exports.flatten = (entity, data) => {
    if (typeof data !== 'object') {
        throw new Error('Deserializer has not correct data to deserialize');
    }

    const params = {};
    for (let index = 0, keys = Object.keys(data), length = keys.length; index < length; index++) {
        if (entity.schema.get(keys[index])) continue;
        params[keys[index]] = data[keys[index]];
        delete data[keys[index]];
    }

    const props = {};
    for (let index = 0, types = entity.schema.values, length = types.length; index < length; index++) {
        const type = types[index];
        if (type.ℹ_regexp) {
            for (let idx = 0, keys = Object.keys(data), length = keys.length; idx < length; idx++) {
                if (!type.key.test(keys[idx])) continue;
                if (!data[type.key]) data[type.key] = {};
                data[type.key][keys[idx]] = data[keys[idx]];
                delete data[keys[idx]];
            }
        }
        if (!Object.prototype.hasOwnProperty.call(data, type.key)) continue;
        Object.assign(props, {
            [type.key]: type.build(data[type.key], type.ℹ_regexp ? {} : undefined, type.key),
        });
        delete data[type.key];
    }
    return props;
};

module.exports.query = (values, params = {}) => {
    const { columns, filters, limit, offset, sorts, group } = params;
    const results = values.filter((item) => {
        if (!filters) return true;
        for (const key in filters) {
            if (Object.prototype.hasOwnProperty.call(filters, key)) {
                if (item[key] !== filters[key]) {
                    return false;
                }
            }
        }
        return true;
    }).sort((a, b) => {
        if (!sorts) return 0;
        for (const key in sorts) {
            if (Object.prototype.hasOwnProperty.call(sorts, key)) {
                if (sorts[key] === 'DESC') {
                    if (a[key] < b[key]) return -1;
                    if (a[key] > b[key]) return 1;
                } else {
                    if (a[key] > b[key]) return -1;
                    if (a[key] < b[key]) return 1;
                }
            }
        }
        return 0;
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
    return text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
        .replace(/\s+/g, '')
    ;
};

module.exports.parse = (data) => {
    console.log(data);
    return JSON.parse(data, (key, value) => {
        if (typeof value === 'string' && !Number.isNaN(Number(value.slice(0, -1))) && value.slice(-1) === 'n') {
            return BigInt(value.slice(0, -1));
        }
        return value;
    });
};

module.exports.stringify = (data, space) => {
    return JSON.stringify(data, (key, value) => {
        if (typeof value === 'bigint') return `${value.toString()}n`;
        return value;
    }, space);
};
