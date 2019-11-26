'use strict';

const _ = require('../utils');
const Field = require('./field');

/**
 * @class Schema
 * @param {Model} model
 * @param {Object} props
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class Schema {
    constructor(model, props) {
        if (props.uuid) {
            throw new Error('Field "uuid" is automatically set');
        }

        this.model = model;
        this.props = props;
        this.classname = this.model.name;
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
        for (let index = 0, fields = !full ? this.fields : this.values, length = fields.length; index < length; index++) {
            if (fields[index].match(key)) return fields[index];
        }
    }

    get fields() {
        if (this._fields) return this._fields;
        this._fields = [];
        for (const key in this.props) {
            if (!this.props.hasOwnProperty(key)) continue;
            this._fields.push(Field.create(this, key, this.props[key]));
        }

        return this._fields.sort((a, b) => {
            if (!a.ƒ_regexp && b.ƒ_regexp) return -1;
            if (a.ƒ_regexp && !b.ƒ_regexp) return 1;
            return 0;
        });
    }

    get keys() {
        if (this._keys) return this._keys;
        return this._keys = this.values.map(field => field.key);
    }

    get values() {
        if (this._values) return this._values;
        if (!this.model.parent) return this._values = this.fields;
        return this._values = [].concat(
            this.model.parent.schema.values,
            this.fields
        ).sort((a, b) => {
            if (!a.ƒ_regexp && b.ƒ_regexp) return -1;
            if (a.ƒ_regexp && !b.ƒ_regexp) return 1;
            return 0;
        });
    }

    toJSON() {
        return this.fields.reduce((accu, field) => {
            return Object.assign({}, accu, {
                [field.key]: field
            });
        }, {});
    }
};
