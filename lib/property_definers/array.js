const models = require('../model');
const MixedPropertyDefiner = require('./mixed');
const ModelPropertyDefiner = require('./model');

class ArrayPropertyDefiner extends MixedPropertyDefiner {
    constructor(instance, field, compound) {
        super(instance, field, compound);
        this.subdefiner = require('./index').get(this.instance, this.field.options.subfield, true);
        this.value = [];
    }

    get() {
        return this.getter()();
    }

    set(value) {
        return this.setter()(value || []);
    }

    define() {
        Object.defineProperty(this.instance.props, this.key, {
            get: this.getter(),
            set: this.setter(),
        });
    }

    setter() {
        return (value) => {
            if (!this.validate(value)) return false;
            const previous = this.value;
            this.value = this.normalize(value);
            this.instance.emit('change', { key: this.key, value: this.value, previous });
            return this.value;
        };
    }

    getter() {
        return () => {
            return this.denormalize(this.value);
        };
    }

    normalize(value) {
        return value.map((item, index) => {
            this.subdefiner.index = index;
            const value = this.subdefiner.normalize(item);
            this.subdefiner.index = undefined;
            return value;
        });
    }

    denormalize(value) {
        return new Collection(this, value);
    }

    validate(value) {
        if (!Array.isArray(value)) {
            throw ArrayPropertyDefiner.createIncorrectTypeError(this, 'array', value);
        }

        value.map((item, index) => {
            try {
                this.subdefiner.index = index;
                const value = this.subdefiner.validate(item);
                this.subdefiner.index = undefined;
                return value;
            } catch (error) {
                if (!(error instanceof MixedPropertyDefiner.IncorrectTypeError)) throw error;
                this.subdefiner.index = undefined;
                if (error.definer.instance.uuid !== this.instance.uuid) throw error;
                if (error.definer.field.key !== this.key) throw error;
                throw ArrayPropertyDefiner.createIncorrectItemTypeError(error);
            }
        });
        return true;
    }
}

ArrayPropertyDefiner.createIncorrectItemTypeError = function (error) {
    const expected = `array of ${error.expected}`;
    throw ArrayPropertyDefiner.createIncorrectTypeError(error.definer, expected, error.type, true);
};

class Collection {
    constructor(definer, value) {
        this.definer = definer;

        const proxy = new Proxy(Array.from(value), {
            get: (target, property, receiver) => {
                if (property === 'first') {
                    return receiver[0];
                } else if (property === 'last') {
                    return receiver[target.length - 1];
                } else if (property === 'remove') {
                    return (item) => {
                        if (!(this.subdefiner instanceof ModelPropertyDefiner)) {
                            throw new Error('Remove method can only be used with collections of models');
                        }
                        const index = target.indexOf(item.uuid);
                        if (index >= 0) {
                            proxy.splice(index, 1);
                        }
                    };
                } else if (['filter'].includes(property)) {
                    return (callback) => {
                        const value = target[property]((id, index, array) => {
                            this.subdefiner.index = index;
                            const item = this.subdefiner.denormalize(id);
                            this.subdefiner.index = undefined;
                            this.propagateChange(item);
                            return callback(item, index, array);
                        });
                        return new Collection(this.definer, value);
                    };
                } else if (['map', 'forEach'].includes(property)) {
                    return (callback) => {
                        return target[property]((id, index, array) => {
                            this.subdefiner.index = index;
                            const item = this.subdefiner.denormalize(id);
                            this.subdefiner.index = undefined;
                            this.propagateChange(item);
                            return callback(item, index, array);
                        });
                    };
                } else if (['reduce', 'reduceRight'].includes(property)) {
                    return (callback, initial) => {
                        return target[property]((accu, id, index, array) => {
                            this.subdefiner.index = index;
                            const item = this.subdefiner.denormalize(id);
                            this.subdefiner.index = undefined;
                            return callback(accu, item, index, array);
                        }, initial);
                    };
                } else if (property === 'splice') {
                    return (index, count, ...inserted) => {
                        const previous = this.value;
                        const value = target.splice(index, count, ...inserted);
                        this.definer.set(target);
                        this.instance.emit('change', { key: this.key, value: this.value, previous });
                        return value;
                    };
                } else if (property === 'toArray') {
                    return () => target;
                } else if (typeof property === 'symbol') {
                    return target[property];
                } else if (!isNaN(Number(property))) {
                    if (target[property]) {
                        this.subdefiner.index = property;
                        const item = this.subdefiner.denormalize(target[property]);
                        this.subdefiner.index = undefined;
                        this.propagateChange(item);
                        return item;
                    }
                }
                return target[property];
            },
            set: (target, property, value) => {
                target[property] = value;
                if (!isNaN(Number(property))) {
                    this.subdefiner.index = property;
                    this.definer.set(target);
                    this.subdefiner.index = undefined;
                }
                return true;
            }
        });
        return proxy;
    }

    propagateChange(item) {
        const Model = models.get();
        if (item instanceof Model) {
            let previous = this.value;
            item.on('change', () => {
                const current = this.value;
                this.instance.emit('change', { key: this.key, value: current, previous });
                previous = current;
            });
        }
    }

    get instance() {
        return this.definer.instance;
    }

    get key() {
        return this.definer.key;
    }

    get subdefiner() {
        return this.definer.subdefiner;
    }

    get value() {
        return this.definer.value;
    }
}

module.exports = ArrayPropertyDefiner;
