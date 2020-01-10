const ƒ_type = require('../index');
const _ = require('../../../utils');

/**
 * Define property on an instance of array
 *
 * @class ƒ_array
 * @alias ArrayPropertyType
 * @extends PropertyType
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
class ƒ_array extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, Array, input, options);
        this.subtype = schema.evaluate(`${this.key}[]`, input[0]);
    }

    static evaluate(input, type) {
        return type === 'object' && Array.isArray(input);
    }

    static get priority() {
        return 0;
    }

    split(idx) {
        const key = `${this.subtype.key.slice(0, -2)}[${idx}]`;
        return this.subtype.sub(key);
    }

    expose(property) {
        return new Collection(property, property.value);
    }

    flatten(value) {
        throw new Error('Array type can\'t flatten data itself');
    }

    format(next, current) {
        this.validate(next);
        if (!next) return next;
        const data = [];
        let idx;
        try {
            for (idx = 0; idx < next.length; idx++) {
                data.push(this.subtype.format(next[idx]));
            }
        } catch (error) {
            if (!(error instanceof ƒ_type.IncorrectTypeError)) throw error;
            if (error.type.key !== this.key) throw error;
            throw this.createIncorrectTypeError(error.expected, error.received, this.split(idx));
        }
        return data;
    }

    normalize(next, current) {
        throw new Error('Array type can\'t normalize data itself');
    }

    shape(value, options) {
        if (!value) return [];
        const data = [];
        let index = 0;
        try {
            const suboptions = Object.assign({}, options, { depth: options.depth - 1 });
            for (index = 0; index < value.length; index++) {
                data.push(this.subtype.shape(value[index], suboptions));
            }
        } catch (error) {
            if (!(error instanceof ƒ_type.IncorrectTypeError)) throw error;
            throw this.createIncorrectTypeError(error.expected, error.received, this.split(index));
        }
        return data;
    }

    validate(value, options = {}) {
        if (this.options.required && value === undefined) {
            throw this.createValidatorError('required', value, 'to be define');
        }
        if (!Array.isArray(value)) {
            throw this.createIncorrectTypeError('array', value);
        }
        if (options.subvalidate) {
            for (let idx = 0; idx < next.length; idx++) {
                this.subtype.validate(value[idx]);
            }
        }
    }

    toBasic(replacer) {
        const value = [this.subtype.toBasic(replacer)];
        if (replacer instanceof Function) return replacer(value, this);
        return value;
    }

    toJSON() {
        return [this.subtype.toJSON()];
    }
}

module.exports = ƒ_array;

class Collection {
    constructor(property, values) {
        this.property = property;

        return new Proxy(Array.from(values), {
            get: (target, property, receiver) => {
                if (property === 'first') {
                    return receiver[0];
                } if (property === 'last') {
                    return receiver[target.length - 1];
                } if (property === 'values') {
                    return target.map((id, index) => {
                        const value = this.property.split(index).set(id).get();
                        this.propagateChange(value, index);
                        return value;
                    });
                } if (['map', 'forEach'].includes(property)) {
                    return (callback) => {
                        return target[property]((id, index, array) => {
                            const value = this.property.split(index).set(id).get();
                            this.propagateChange(value, index);
                            return callback(value, index, array);
                        });
                    };
                } if (property === 'filter') {
                    return (callback) => {
                        const filtered = target.filter((id, index, array) => {
                            const value = this.property.split(index).set(id).get();
                            return callback(value, index, array);
                        });
                        return new Collection(this.property, filtered);
                    };
                } if (property === 'sort') {
                    return (callback) => {
                        const sorted = Array.from(target).sort(callback);
                        this.property.set(sorted);
                        return new Collection(this.property, sorted);
                    };
                } if (property === 'slice') {
                    return (begin, end) => {
                        const slice = Array.from(target).slice(begin, end);
                        return new Collection(this.property, slice);
                    };
                } if (property === 'query') {
                    return _.query.bind(null, receiver);
                } if (['reduce', 'reduceRight'].includes(property)) {
                    return (callback, initial) => {
                        return target[property]((accu, id, index, array) => {
                            const value = this.property.split(index).set(id).get();
                            return callback(accu, value, index, array);
                        }, initial);
                    };
                } if (property === 'remove') {
                    return (entry) => {
                        const subproperty = this.property.split(0);
                        const filtered = target.filter((item) => {
                            if (typeof entry === 'object') {
                                if (subproperty.type.is('ƒ_model')) {
                                    return item !== entry.uuid;
                                }
                            }
                            return item !== entry;
                        });
                        this.property.set(filtered);
                    };
                } if (property === 'splice') {
                    return (index, count, ...inserted) => {
                        const value = target.splice(index, count, ...inserted);
                        this.property.set(target);
                        return value;
                    };
                } if (property === 'toArray') {
                    return () => target;
                } if (typeof property === 'symbol') {
                    return target[property];
                } if (!Number.isNaN(Number(property))) {
                    property = Number(property);
                    if (target[property]) {
                        const subproperty = this.property.split(property);
                        const value = subproperty.set(target[property]).get();
                        this.propagateChange(value, property);
                        return value;
                    }
                }
                return target[property];
            },
            set: (target, property, value) => {
                if (!Number.isNaN(Number(property))) {
                    property = Number(property);
                    const subproperty = this.property.split(property);
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
}
