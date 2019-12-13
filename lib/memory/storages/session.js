const helper = require('../../utils/storage/session');
const Storage = require('./index');

module.exports = class SessionStorage extends Storage {
    constructor(name) {
        super(name);

        return new Proxy(this, {
            get(target, property) {
                const data = JSON.parse(helper[target.name] || '[]');
                return data.find(item => item.uuid === property);
            },
            set(target, property, value) {
                const data = JSON.parse(helper[target.name] || '[]');
                const index = data.findIndex(element => element.uuid === property);
                if (index >= 0) data.splice(index, 1, value);
                else data.push(value);
                helper[target.name] = JSON.stringify(data);
                return value;
            },
            deleteProperty(target, property) {
                const data = JSON.parse(helper[target.name] || '[]');
                const index = data.findIndex(item => item.uuid === property);
                const item = data.splice(index, 1);
                helper[target.name] = JSON.stringify(data);
                return item;
            }
        });
    }
};
