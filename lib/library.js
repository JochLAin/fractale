
const EventListener = require('./event_listener');
const memory = require('./memory');

/**
 * Class that store models
 * @class Encyclopedia
 * @param {Library} library - Library attached to encyclopedia
 * @param {String} name - Model name
 * @param {Object} schema - Model schema
 * @param {ModelClass} model - Model class
 * @param {Boolean} virtual - Specify if is auto-generated class
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
class Encyclopedia extends EventListener {
    constructor(library, name, schema, entity, virtual) {
        super();
        this.library = library;
        this.name = name.toLowerCase();
        this.memory = memory.create(this.name);
        this.schema = Object(schema);
        this.entity = entity;
        this.virtual = virtual;
    }
}

/**
 * Model storage manager
 *
 * @class Library
 * @extends EventListener
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
class Library extends EventListener {
    constructor() {
        super();
        this.encyclopedias = [];
    }

    /**
     * Get all encyclopedias
     * @param {Boolean} with_virtual - Specify if auto-generated models must be included
     * @returns {Encyclopedia[]}
     */
    all(with_virtual = false) {
        if (with_virtual) {
            return this.encyclopedias;
        }
        return this.encyclopedias.filter(e => !e.virtual);
    }

    /**
     * Add new encyclopedia to library
     * @param {String} name - Model name
     * @param {Object} schema - Model schema
     * @param {ModelClass} entity - Model class
     * @param {Boolean} virtual - Specify if is auto-generated class
     */
    fill(name, schema, entity, virtual) {
        const encyclopedia = new Encyclopedia(this, name, schema, entity, virtual);
        this.encyclopedias.push(encyclopedia);
        this.dispatchEvent('fill', { name });
    }

    /**
     * Get an encyclopedia by its name
     * @param {String} name
     * @returns {Encyclopedia}
     */
    get(name) {
        if (!this.names.includes(name.toLowerCase())) {
            return false;
            // throw new Error(`Model with name "${name}" doesn't exists.`);
        }
        return this.encyclopedias.find(encyclopedia => encyclopedia.name === name.toLowerCase());
    }

    /**
     * Get all encyclopedias names
     * @returns {String[]}
     */
    get names() {
        return this.encyclopedias.map(encyclopedia => encyclopedia.name);
    }
}

module.exports = new Library();