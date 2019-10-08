
const EventListener = require('../event_listener');
const Encyclopedia = require('./encyclopedia');

/**
 * Model storage manager
 *
 * @class Library
 * @extends EventListener
 *
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
     * @param {Proxy} proxy - Proxy class
     * @param {Boolean} virtual - Specify if is auto-generated class
     */
    fill(name, schema, entity, proxy, virtual) {
        const encyclopedia = new Encyclopedia(this, name, schema, entity, proxy, virtual);
        this.encyclopedias.push(encyclopedia);
        this.dispatchEvent('fill', { name });
    }

    /**
     * Get an encyclopedia by its name
     * @param {String} name
     * @returns {Encyclopedia|boolean}
     */
    get(name) {
        if (!this.names.includes(name.toLowerCase())) {
            return false;
            // throw new Error(`Model with name "${name}" doesn't exists.`);
        }
        return this.encyclopedias.find(encyclopedia => encyclopedia.slug === name.toLowerCase());
    }

    register(instance, params) {
        const encyclopedia = this.get(instance.constructor.name);
        encyclopedia.memory.load(instance.serialize(false));
        if (!params.uuid) encyclopedia.memory.create(instance.serialize(false));
        instance.addEventListener('change', ({ value, previous }) => {
            if (value !== previous) encyclopedia.memory.update(instance.serialize(false));
        });
    }

    /**
     * Get all encyclopedias names
     * @returns {String[]}
     */
    get names() {
        return this.encyclopedias.map(encyclopedia => encyclopedia.slug);
    }
}

module.exports = new Library();