
const { singularize } = require('../inflector');
const ModelClass = require('../model');
const MixedPropertyDefiner = require('./mixed');

class ArrayPropertyDefiner extends MixedPropertyDefiner {
    constructor(instance, key, type, options) {
        super(instance, key, type, options);

        this.singular = singularize(this.key);
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
            this.singular,
            this.subdefiner
        );
    }

    assign() {
        this.instance[`_${this.key}`] = [];
    }

    check(value) {
        if (value !== null && !Array.isArray(value)) {
            throw ArrayPropertyDefiner.createUncorrectTypeError(this, value, 'array || null');
        }
        for (let index in value) {
            this.item.check(value[index]);
        }
        return value;
    }

    define() {
        Object.defineProperty(this.instance, this.key, {
            get: this.getter(),
            set: this.setter(),
        });
        this.item.define();
    }

    getter() {
        return () => {
            return this.denormalize(this.instance[`_${this.key}`]);
        };
    }

    setter() {
        return (value) => {
            value = this.check(value);
            this.instance[`_${this.key}`] = this.normalize(value);
            this.instance.dispatchEvent('change', { key: this.key, value });
        };
    }

    normalize(value) {
        if (value === null) {
            return value;
        }

        return value.map(item => {
            return this.item.normalize(item);
        });
    }

    denormalize(value) {
        if (value === null) {
            return value;
        }

        return value.map(item => {
            return this.item.denormalize(item);
        });
    }
}

class ItemPropertyDefiner extends MixedPropertyDefiner {
    constructor(instance, key, type, options, singular, subdefiner) {
        super(instance, key, type, options);
        this.singular = singular;
        this.subdefiner = subdefiner;
    }

    check(value) {
        try {
            this.subdefiner.check(value);
        } catch (error) {
            throw MixedPropertyDefiner.createUncorrectItemTypeError(error, this.key);
        }
        return value;
    }

    define() {
        if (Array.isArray(this.singular)) {
            for (let index in this.singular) {
                if (this.singular !== this.key) {
                    Object.defineProperty(this.instance, this.singular[index], {
                        get: this.getter(),
                        set: this.setter(),
                    });
                }
            }
        } else {
            Object.defineProperty(this.instance, this.singular, {
                get: this.getter(),
                set: this.setter(),
            });
        }
    }

    getter() {
        return () => {
            return (id) => {
                let index = -1;
                if (typeof id == 'number') {
                    index = id;
                } else if (typeof id == 'string') {
                    index = this.instance[this.key].findIndex(value => {
                        return value && value.uuid === id;
                    });
                }

                if (index >= 0) {
                    return this.denormalize(this.instance[`_${this.key}`][index]);
                }
            }
        }
    }

    // Manage push and update
    setter() {
        return (value) => {
            value = this.check(value);

            let index = -1;
            if (this.subdefiner.type instanceof ModelClass) {
                index = this.instance[`_${this.key}`].findIndex(item => item.uuid === value.uuid);
            }

            if (index >= 0) {
                this.instance[`_${this.key}`][index] = this.normalize(value);
            } else {
                this.instance[`_${this.key}`].push(this.normalize(value));
            }
            this.instance.dispatchEvent('change', { key: this.key, value });
        }
    }

    normalize(value) {
        return this.subdefiner.normalize(value)
    }

    denormalize(value) {
        return this.subdefiner.denormalize(value);
    }
}

module.exports = ArrayPropertyDefiner;
ArrayPropertyDefiner.ItemPropertyDefiner = ItemPropertyDefiner;