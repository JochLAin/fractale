
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
    constructor(library, name, schema, entity, virtual) {
        this.library = library;
        this.name = name;
        this.slug = this.name.toLowerCase();
        this.memory = memory.createProvider(this);
        this.schema = Object(schema);
        this.entity = entity;
        this.virtual = virtual;
    }
};
