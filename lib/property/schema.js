const Field = require('./field');

/**
 * Schema class
 * @class Schema
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
class Schema {
    constructor(entity, props = {}) {
        if (props.uuid) {
            throw new Error('Field "uuid" is automatically set');
        }

        this.entity = entity;
        this.classname = entity.name;

        this.fields = [];
        for (const key in props) {
            if (!props.hasOwnProperty(key)) continue;
            const value = props[key] === null ? undefined : props[key];
            this.fields.push(new Field(this, key, value));
        }

        if (!this.parent) this.values = this.fields;
        else this.values = [].concat(this.parent.schema.values, this.fields);
        this.keys = this.values.map(field => field.key);
    }

    filter(params) {
        const keys = this.fields.map(field => field.key);
        const props = {};
        for (const key in params) {
            if (!params.hasOwnProperty(key)) continue;
            if (keys.includes(key)) continue;
            props[key] = params[key];
            delete params[key];
        }
        return props;
    }

    get(key, full = true) {
        return (!full ? this.fields : this.values).find(field => field.is(key));
    }

    has(key, full = true) {
        return !!(!full ? this.fields : this.values).find(field => field.is(key));
    }

    instantiate(instance) {
        const properties = instance.ƒ_properties || new Map();
        for (let index = 0, length = this.fields.length; index < length; index++) {
            properties.set(
                this.fields[index].key,
                this.fields[index].instantiate(instance)
            );
        }
        instance.ƒ_properties = properties;
        return properties;
    }

    get factory() {
        if (this._factory) return this._factory;
        return this._factory = require('../factory');
    }

    get ƒ_schema() {
        return true;
    }

    toJSON() {
        return this.fields.reduce((accu, field) => {
            return Object.assign({}, accu, {
                [field.key]: field
            });
        }, {});
    }
}

module.exports = Schema;
