const { singularize } = require('../inflector');
const ModelClass = require('../model');
const MixedPropertyDefiner = require('./mixed');
const ModelPropertyDefiner = require('./model');
const SimplePropertyDefiner = require('./simple');

class ArrayPropertyDefiner extends MixedPropertyDefiner {
    constructor(instance, key, type, options) {
        super(instance, key, type, options);

        this.singulars = singularize(this.key);
        this.singular = Array.isArray(this.singulars) ? this.singulars[0] : this.singulars;
        if (!Array.isArray(this.singular) && this.singular === this.key) {
            throw new Error(`${this.singular} is already a singular or the same as plural (${this.key})`);
        }

        this.subdefiner = require('./index').get(
            this.instance,
            this.singular,
            this.type[0]
        );

        this.item = new ItemPropertyDefiner(
            this.instance,
            this.key,
            this.type[0],
            undefined,
            this.singulars,
            this.subdefiner,
            this
        );
    }

    assign() {
        this.instance.props[`_${this.key}`] = [];
    }

    check(value) {
        if (value !== null && !Array.isArray(value)) {
            throw ArrayPropertyDefiner.createIncorrectTypeError(this, value, 'array || null');
        }
        return value.map(value => this.item.check(value));
    }

    define() {
        Object.defineProperty(this.instance.props, this.key, {
            get: this.getter(),
            set: this.setter(),
        });
        this.item.define();
    }

    getter() {
        return () => {
            return this.denormalize(this.value);
        };
    }

    setter() {
        return (value) => {
            const previous = this.value;
            this.value = this.normalize(this.check(value));
            this.instance.dispatchEvent('change', { key: this.key, value: this.value, previous });
            return value;
        };
    }

    normalize(value) {
        if (value === null) {
            return value;
        }

        return value.map(item => {
            return this.item.normalize(item);
        }).filter(item => item);
    }

    denormalize(value) {
        if (value === null) {
            return value;
        }

        return new Collection(this, value);
    }

    propagateChange(item) {
        if (item && item.addEventListener instanceof Function) {
            let previous = this.value;
            item.addEventListener('change', () => {
                const current = this.value;
                this.instance.dispatchEvent('change', { key: this.key, value: current, previous });
                previous = current;
            });
        }
    }
}

class ItemPropertyDefiner extends MixedPropertyDefiner {
    constructor(instance, key, type, options, singular, subdefiner, parent) {
        super(instance, key, type, options);
        this.singular = singular;
        this.subdefiner = subdefiner;
        this.parent = parent;
    }

    check(value) {
        try {
            value = this.subdefiner.check(value);
        } catch (error) {
            if (!error.definer) throw error;
            throw MixedPropertyDefiner.createIncorrectItemTypeError(error, this.key);
        }
        return value;
    }

    define() {
        if (Array.isArray(this.singular)) {
            for (let index in this.singular) {
                if (this.singular !== this.key) {
                    if (!this.instance[this.singular[index]]) {
                        Object.defineProperty(this.instance, this.singular[index], {
                            set: this.setter(),
                        });
                    }
                }
            }
        } else if (!this.instance[this.singular]) {
            Object.defineProperty(this.instance, this.singular, {
                set: this.setter(),
            });
        }
    }

    normalize(value) {
        return this.subdefiner.normalize(value)
    }

    denormalize(value) {
        return this.subdefiner.denormalize(value);
    }

    set value(value) {
        let index = -1;
        if (this.subdefiner.type instanceof ModelClass) {
            index = this.instance.props[`_${this.key}`].findIndex(item => item.uuid === value);
        }

        if (index >= 0) {
            this.instance.props[`_${this.key}`][index] = value;
        } else {
            this.instance.props[`_${this.key}`].push(value);
        }
    }
}

class Collection {
    constructor(definer, value) {
        const proxy = new Proxy(value, {
            get: (target, property, receiver) => {
                if (property === 'first') {
                    return receiver[0];
                } else if (property === 'last') {
                    return receiver[target.length - 1];
                } else if (property === 'remove') {
                    return (item) => {
                        let index = -1;
                        if (definer.subdefiner instanceof SimplePropertyDefiner) {
                            index = target.indexOf(item);
                        } else if (definer.subdefiner instanceof ModelPropertyDefiner) {
                            index = target.indexOf(item.uuid);
                        }
                        if (index >= 0) {
                            proxy.splice(index, 1);
                        }
                    };
                } else if (property === 'forEach') {
                    return (callback) => {
                        return target[property]((id, index, array) => {
                            const item = definer.item.denormalize(id);
                            definer.propagateChange(item);
                            return callback(item, index, array);
                        });
                    };
                } else if (['filter'].includes(property)) {
                    return (callback) => {
                        return new Collection(definer, target[property]((id, index, array) => {
                            const item = definer.item.denormalize(id);
                            definer.propagateChange(item);
                            return callback(item, index, array);
                        }));
                    };
                } else if (['map'].includes(property)) {
                    return (callback) => {
                        return target[property]((id, index, array) => {
                            const item = definer.item.denormalize(id);
                            definer.propagateChange(item);
                            return callback(item, index, array);
                        });
                    };
                } else if (['reduce', 'reduceRight'].includes(property)) {
                    return (callback, initial) => {
                        return target[property]((accu, id, index, array) => {
                            const item = definer.item.denormalize(id);
                            return callback(accu, item, index, array);
                        }, initial);
                    };
                } else if (property === 'splice') {
                    return (index, count, ...inserted) => {
                        const previous = definer.value;
                        const value = target.splice(index, count, ...inserted);
                        definer.instance.dispatchEvent('change', { key: definer.key, value: definer.value, previous });
                        return value;
                    };
                } else if (typeof property === 'symbol') {
                    return target[property];
                } else if (!isNaN(Number(property))) {
                    if (value[property]) {
                        const item = definer.item.denormalize(value[property]);
                        definer.propagateChange(item);
                        return item;
                    }
                }
                return target[property];
            },
            set: (target, property, value) => {
                target[property] = value;
                if (!isNaN(Number(property))) {
                    definer.instance.props[definer.key] = target;
                }
                return true;
            }
        });
        return proxy;
    }
}

module.exports = ArrayPropertyDefiner;
ArrayPropertyDefiner.ItemPropertyDefiner = ItemPropertyDefiner;
