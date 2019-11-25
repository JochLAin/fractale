module.exports.toPascalCase = (text) => text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');

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
