
const { singularize } = require('../inflector');
const ModelClass = require('../model');
const MixedPropertyDefiner = require('./mixed');
const { promisified } = require('../helper/promise');

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
            this.singulars,
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
            throw ArrayPropertyDefiner.createUncorrectTypeError(this, value, 'array || null');
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
            return this.denormalize(this.instance.props[`_${this.key}`]);
        };
    }

    setter() {
        return (value) => {
            return promisified(this.check(value), (value) => {
                this.value = this.normalize(value);
                this.instance.dispatchEvent('change', { key: this.key, value: this.value });
            });
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

        return new Proxy(Array(value.length).fill(undefined), {
            get: (target, property) => {
                if (property === 'last') {
                    return () => target[target.length -1];
                }
                if (!isNaN(Number(property))) {
                    if (value[property]) {
                        return this.item.denormalize(value[property]);
                    }
                }
                return target[property];
            },
            set: (target, property, value) => {
                target[property] = value;
                if (!isNaN(Number(property))) {
                    this.instance.props[this.key] = target;
                }
                return value;
            }
        });
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
        return promisified(this.subdefiner.check(value), value => {
            return value;
        }, (error) => {
            throw MixedPropertyDefiner.createUncorrectItemTypeError(error, this.key);
        });
    }

    define() {
        if (Array.isArray(this.singular)) {
            for (let index in this.singular) {
                if (this.singular !== this.key) {
                    Object.defineProperty(this.instance.props, this.singular[index], {
                        get: this.getter(),
                        set: this.setter(),
                    });
                }
            }
        } else {
            Object.defineProperty(this.instance.props, this.singular, {
                get: this.getter(),
                set: this.setter(),
            });
        }
    }

    getter() {
        return () => {
            const callback = (index) => {
                if (index >= 0) {
                    return this.denormalize(this.instance.props[`_${this.key}`][index]);
                }
            };

            return (id) => {
                if (typeof id !== 'string') {
                    return callback(id);
                }
                return promisified(this.instance.props[this.key], (items) => {
                    const index = items.findIndex(value => value && value.uuid === id);
                    return callback(index);
                });
            }
        }
    }

    // Manage push and update
    setter() {
        return (value) => {
            return promisified(this.check(value), (value) => {
                this.value = this.normalize(value);
                this.instance.dispatchEvent('change', { key: this.key, value: this.value });
                return this.value;
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
            index = this.instance.props[`_${this.key}`].findIndex(item => item.uuid === value.uuid);
        }

        if (index >= 0) {
            this.instance.props[`_${this.key}`][index] = this.normalize(value);
        } else {
            this.instance.props[`_${this.key}`].push(this.normalize(value));
        }
    }

    get value() {
        return this.parent.value;
    }
}

module.exports = ArrayPropertyDefiner;
ArrayPropertyDefiner.ItemPropertyDefiner = ItemPropertyDefiner;