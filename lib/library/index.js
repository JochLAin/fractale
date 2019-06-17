
const EventListener = require('../event_listener');
const Encyclopedia = require('./encyclopedia');

/**
 * Model storage manager
 *
 * @class Index
 * @extends EventListener
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
class Index extends EventListener {
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

module.exports = new Index();