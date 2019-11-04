const memory = require('../memory');

/**
 * Class that store models
 *
 * @class Encyclopedia
 * @param {Index} library - Index attached to encyclopedia
 * @param {String} name - Model name
 * @param {Object} schema - Model schema
 * @param {ModelClass} model - Model class
 * @param {Boolean} virtual - Specify if is auto-generated class
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class Encyclopedia {
    constructor(library, name, schema, entity, proxy, parent, virtual) {
        this.library = library;
        this.name = name;
        this.slug = this.name.toLowerCase();
        this.memory = memory.createProvider(this);
        this.__schema = Object(schema);
        this.entity = entity;
        this.proxy = proxy;
        this.parent = parent;
        this.virtual = virtual;
    }

    get schema() {
        if (this._schema) return this._schema;
        if (!this.parent) return this.__schema;
        const pe = this.library.get(this.parent.name);
        return this._schema = Object.assign({}, pe.schema, this.__schema);
    }
};
