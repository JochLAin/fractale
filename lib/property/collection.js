const { FIELD_KIND_MODEL } = require('../constants');

module.exports = class Collection {
    constructor(property, value) {
        this.property = property;
        this.field = property.field;
        this.item = property.options.item;

        const proxy = new Proxy([].concat(value), {
            get: (target, property, receiver) => {
                if (property === 'first') {
                    return receiver[0];
                } else if (property === 'last') {
                    return receiver[target.length - 1];
                } else if (property === 'remove') {
                    return (entry) => {
                        this.property.set(target.filter((item) => {
                            if (this.item.kind === FIELD_KIND_MODEL) {
                                return item !== entry.uuid;
                            }
                            return item !== entry;
                        }));
                    };
                } else if (['filter'].includes(property)) {
                    return (callback) => {
                        const value = target[property]((id, index, array) => {
                            const PropertyItem = this.item.instantiate(this.property.instance, index);
                            PropertyItem.set(id);
                            const item = PropertyItem.get();
                            this.propagateChange(item, index);
                            return callback(item, index, array);
                        });
                        return new Collection(this.property, value);
                    };
                } else if (['map', 'forEach'].includes(property)) {
                    return (callback) => {
                        return target[property]((id, index, array) => {
                            const PropertyItem = this.item.instantiate(this.property.instance, index);
                            PropertyItem.set(id);
                            const item = PropertyItem.get();
                            this.propagateChange(item, index);
                            return callback(item, index, array);
                        });
                    };
                } else if (['reduce', 'reduceRight'].includes(property)) {
                    return (callback, initial) => {
                        return target[property]((accu, id, index, array) => {
                            const PropertyItem = this.item.instantiate(this.property.instance, index);
                            PropertyItem.set(id);
                            const item = PropertyItem.get();
                            return callback(accu, item, index, array);
                        }, initial);
                    };
                } else if (property === 'splice') {
                    return (index, count, ...inserted) => {
                        const value = target.splice(index, count, ...inserted);
                        this.property.set(target);
                        return value;
                    };
                } else if (property === 'toArray') {
                    return () => target;
                } else if (property === 'query') {
                    return (params = {}) => {
                        const { columns, filters, limit, offset, sorts, group } = params;
                        const results = proxy.filter(item => {
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
                        }).map(item => {
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
                } else if (typeof property === 'symbol') {
                    return target[property];
                } else if (!isNaN(Number(property))) {
                    if (target[property]) {
                        const PropertyItem = this.item.instantiate(this.property.instance, property);
                        PropertyItem.set(target[property]);
                        const item = PropertyItem.get();
                        this.propagateChange(item, property);
                        return item;
                    }
                }
                return target[property];
            },
            set: (target, property, value) => {
                target[property] = value;
                if (!isNaN(Number(property))) {
                    this.property.set(target);
                }
                return true;
            }
        });
        return proxy;
    }

    propagateChange(item, index) {
        if (item.constructor && item.on) {
            let previous = this.property.value;
            item.on('change', () => {
                const current = this.property.value;
                this.property.instance.emit('change', {
                    key: `${this.field.key}[${index}]`,
                    value: current,
                    previous
                });
                previous = current;
            });
        }
    }
};
