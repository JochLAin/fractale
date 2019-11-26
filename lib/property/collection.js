'use strict';

const _ = require('../utils');

module.exports = class Collection {
    constructor(property, values) {
        this.property = property;

        return new Proxy(Array.from(values), {
            get: (target, property, receiver) => {
                if (property === 'first') {
                    return receiver[0];
                } else if (property === 'last') {
                    return receiver[target.length - 1];
                } else if (property === 'values') {
                    return target.map((id, index) => {
                        const value = this.property.fork(index).set(id).get();
                        this.propagateChange(value, index);
                        return value;
                    });
                } else if (['map', 'forEach'].includes(property)) {
                    return (callback) => {
                        return target[property]((id, index, array) => {
                            const value = this.property.fork(index).set(id).get();
                            this.propagateChange(value, index);
                            return callback(value, index, array);
                        });
                    };
                } else if (property === 'filter') {
                    return (callback) => {
                        const value = target[property]((id, index, array) => {
                            const value = this.property.fork(index).set(id).get();
                            this.propagateChange(value, index);
                            return callback(value, index, array);
                        });
                        return new Collection(this.property, value);
                    };
                } else if (property === 'query') {
                    return _.query.bind(null, receiver);
                } else if (['reduce', 'reduceRight'].includes(property)) {
                    return (callback, initial) => {
                        return target[property]((accu, id, index, array) => {
                            const value = this.property.fork(index).set(id).get();
                            this.propagateChange(value, index);
                            return callback(accu, value, index, array);
                        }, initial);
                    };
                } else if (property === 'remove') {
                    return (entry) => {
                        const subproperty = this.property.fork(0);
                        const filtered = target.filter((item) => {
                            if (typeof entry === 'object') {
                                if (subproperty.field.is('ƒ_model')) {
                                    return item !== entry.uuid;
                                }
                            }
                            return item !== entry;
                        });
                        this.property.set(filtered);
                    };
                } else if (property === 'splice') {
                    return (index, count, ...inserted) => {
                        const value = target.splice(index, count, ...inserted);
                        this.property.set(target);
                        return value;
                    };
                } else if (property === 'toArray') {
                    return () => target;
                } else if (typeof property === 'symbol') {
                    return target[property];
                } else if (!isNaN(Number(property))) {
                    property = Number(property);
                    if (target[property]) {
                        const subproperty = this.property.fork(property);
                        const value = subproperty.set(target[property]).get();
                        this.propagateChange(value, property);
                        return value;
                    }
                }
                return target[property];
            },
            set: (target, property, value) => {
                if (!isNaN(Number(property))) {
                    property = Number(property);
                    const subproperty = this.property.fork(property);
                    target[property] = subproperty.set(value).get();
                    this.property.set(target);
                } else {
                    target[property] = value;
                }
                return true;
            }
        });
    }

    propagateChange(item, index) {
        if (item.constructor && item.on) {
            let previous = this.property.value;
            item.on('change', () => {
                const current = this.property.value;
                this.property.instance.emit('change', {
                    key: `${this.property.key}[${index}]`,
                    value: current,
                    previous
                });
                previous = current;
            });
        }
    }
};
