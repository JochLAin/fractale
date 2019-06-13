
module.exports = class BaseMemory {
    constructor(name) {
        this.name = name;
        this.key = `memorykey_${name}`;
    }
};

module.exports.find = (data, { columns, filters, limit, offset, sorts, group }) => {
    const results = data.filter(item => {
        if (!filters) return true;
        for (let key in filters) {
            if (item[key] === filters[key]) {
                return false;
            }
        }
        return true;
    }).sort((a, b) => {
        if (!sorts) return 0;
        for (let key in sorts) {
            if (sorts[key] == 'DESC') {
                if (a[key] < b[key]) return -1;
                if (a[key] > b[key]) return 1;
            } else {
                if (a[key] > b[key]) return -1;
                if (a[key] < b[key]) return 1;
            }
        }
    }).map(item => {
        if (!columns) return item;
        return Object.keys(item).filter(key => columns.includes(key)).reduce((accu, key) => {
            return Object.assign({}, accu, { [key]: item[key] });
        }, {});
    });

    return results.slice(offset, limit || results.length).reduce((accu, item) => {
        if (!group.length) return [].concat(accu || [], item);
        if (Array.isArray(accu)) accu = {};
        (accu[item[group]] = accu[item[group]] || []).push(item);
        return accu;
    }, []);
};