'use strict';

const uuid = require('uuid');
const factory = require('../../factory');
const library = require('../../library');
const _ = require('../../utils');
const ƒ_type = require('./index');

module.exports = class ƒ_model extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, input, options);

        const _typeof = typeof this.input;
        if (_typeof === 'function') {
            this.input = input;
        } else if (_typeof === 'string' && this.input === 'ƒ_self') {
            this.input = library.get(this.schema.classname);
        } else if (_typeof === 'object') {
            if (input.hasOwnProperty('ƒ_from')) {
                this.input = library.get(input.ƒ_from);
            } else {
                const name = `${this.schema.classname}_${_.toPascalCase(this.key)}`;
                const model = library.get(name);
                if (!model) {
                    this.input = factory.createModel(name, input, { virtual: true });
                } else {
                    this.input = model;
                }
            }
        }
    }

    static evaluate(input, type) {
        return type === 'string' && input === 'ƒ_self'
            || type === 'function' && input.hasOwnProperty('ƒ_model')
            || type === 'object'
        ;
    }

    static get priority() {
        return -1;
    }

    normalize(next, current) {
        if (!next) return undefined;
        if (typeof next === 'string') return next;
        if (next.ƒ_entity) return next.uuid;
        const props = Object.assign({}, current && this.input.memory.read(current), next);
        return this.flatten(props);
    }

    expose(property) {
        const value = property.value && this.input.memory.read(property.value);
        if (!value) return value;
        if (this.options.through) {
            for (let index = 0, length = this.options.through.length; index < length; index++) {
                const key = this.options.through[index];
                value[key] = property.instance.get(key);
            }
        }
        const item = new this.input.proxy(value);
        item.on('change', ({ key, previous, value }) => {
            property.instance.emit('change', {
                key: `${property.key}.${key}`,
                previous,
                value
            });
        });
        return item;
    }

    flatten(value) {
        if (!value) return;
        if (typeof value === 'string') return value;
        if (value.ƒ_entity) return value.uuid;
        const props = _.flatten(this.input, value);
        if (!props.uuid) {
            props.uuid = uuid.v4();
            this.input.memory.create(props);
        } else {
            this.input.memory.load(props);
        }
        return props.uuid;
    }

    shape(value, options) {
        if (!value) return;
        if (!options.populate) return value;
        if (options.depth <= 0) return value;
        if (options.recorded.has(value)) {
            return options.recorded.get(value);
        }
        if (typeof options.populate === 'string' && !this.input.schema.keys.includes(options.populate)) {
            options.recorded.set(value, value);
            return value;
        }

        const props = typeof value === 'string' ? this.input.memory.read(value) : value;
        if (typeof options.populate === 'string') {
            const tmp = props[options.populate];
            options.recorded.set(value, tmp);
            return tmp;
        }
        if (typeof options.populate === 'function') {
            const tmp = options.populate(props, this.input, options);
            options.recorded.set(value, tmp);
            return tmp;
        }

        if (options.populate === true) {
            options.recorded.set(value, value);
            const serialized = { uuid: props.uuid };
            const types = this.input.schema.values;
            const suboptions = Object.assign({}, options, { depth: options.depth - 1 });
            for (let index = 0, length = types.length; index < length; index++) {
                const type = types[index];
                Object.assign(serialized, {
                    [type.key]: type.serialize(props[type.key], suboptions),
                });
            }
            return serialized;
        }
        return value;
    }

    validate(value) {
        if (value === undefined) return;
        if (typeof value !== 'string' && typeof value !== 'object') {
            throw this.createIncorrectTypeError(`${this.input.name} || uuid || undefined`, value);
        }

        if (!this.validator) return;
        super.validate(value);
    }

    toJSON() {
        if (this.input.virtual) {
            return this.input.schema.toJSON();
        }
        return this.input.name;
    }
};
