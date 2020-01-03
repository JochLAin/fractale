const uuid = require('uuid');
const factory = require('../../factory');
const library = require('../../library');
const _ = require('../../utils');
const ƒ_type = require('./index');

module.exports = class ƒ_model extends ƒ_type {
    constructor(schema, key, input, options) {
        const _typeof = typeof input;
        let model;
        if (_typeof === 'function') {
            model = input;
        } else if (_typeof === 'string' && input === 'ƒ_self') {
            model = library.get(schema.classname);
        } else if (_typeof === 'object') {
            if (Object.prototype.hasOwnProperty.call(input, 'ƒ_from')) {
                model = library.get(input.ƒ_from);
            } else {
                const name = `${schema.classname}_${_.toPascalCase(key)}`;
                model = library.get(name);
                if (!model) {
                    model = factory.createModel(name, input, { virtual: true });
                }
            }
        }

        super(schema, key, model, input, options);
        if (this.options.through && Array.isArray(this.options.through)) {
            this.options.through = this.options.through.reduce((accu, item) => {
                return Object.assign({}, accu, { [item]: item });
            }, {});
        }
    }

    static evaluate(input, type) {
        return type === 'string' && input === 'ƒ_self'
            || type === 'function' && Object.prototype.hasOwnProperty.call(input, 'ƒ_model')
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
        const props = Object.assign({}, current && this.generator.memory.read(current), next);
        return this.flatten(props);
    }

    expose(property) {
        if (property.value === undefined) return;
        const value = this.generator.memory.read(property.value);
        if (!value) return value;

        if (this.options.through) {
            for (let index = 0, keys = Object.keys(this.options.through); index < keys.length; index++) {
                value[keys[index]] = property.instance.get(this.options.through[keys[index]]);
            }
        }
        const item = new this.generator.proxy(value);
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
        const props = _.flatten(this.generator, value);
        if (!props.uuid) {
            props.uuid = uuid.v4();
            this.generator.memory.create(props);
        } else {
            this.generator.memory.load(props);
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
        if (typeof options.populate === 'string' && !this.generator.schema.keys.includes(options.populate)) {
            options.recorded.set(value, value);
            return value;
        }

        const props = typeof value === 'string' ? this.generator.memory.read(value) : value;
        if (typeof options.populate === 'string') {
            const tmp = props[options.populate];
            options.recorded.set(value, tmp);
            return tmp;
        }
        if (typeof options.populate === 'function') {
            const tmp = options.populate(props, this.generator, options);
            options.recorded.set(value, tmp);
            return tmp;
        }

        if (options.populate === true) {
            options.recorded.set(value, value);
            const serialized = { uuid: props.uuid };
            const types = this.generator.schema.values;
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
        if (value === undefined || value === null) {
            if (!this.options.required) return;
            throw this.createValidatorError('required', value, 'to be define');
        }
        if ((typeof value === 'string' ? !/([A-Za-z0-9]+-){4}[A-Za-z0-9]+/.test(value) : false) && typeof value !== 'object') {
            throw this.createIncorrectTypeError(`${this.generator.name} || uuid || undefined`, value);
        }

        if (!this.validator) return;
        super.validate(value);
    }

    toBasic(replacer) {
        const value = Object;
        if (replacer instanceof Function) return replacer(value, this);
        return value;
    }

    toJSON() {
        if (Object.keys(this.options).length) {
            if (this.generator.virtual) {
                return `Fractale.with(${_.stringify(this.generator.schema.toJSON())}, ${_.stringify(this.options)})`;
            }
            return `Fractale.with(${this.generator.name}, ${_.stringify(this.options)})`;
        }
        if (this.generator.virtual) {
            return this.generator.schema.toJSON();
        }
        return this.generator.name;
    }
};
