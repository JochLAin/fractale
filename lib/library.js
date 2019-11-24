const EventListener = require('./event_listener');

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
        this.entities = [];
    }

    /**
     * Get all entities
     * @param {Boolean} with_virtual - Specify if auto-generated models must be included
     * @returns {Model[]}
     */
    all(with_virtual = false) {
        if (with_virtual) {
            return this.entities;
        }
        return this.entities.filter(entity => !entity.virtual);
    }

    /**
     * Add new entity to library
     * @param {Model} entity - Model class
     */
    add(entity) {
        this.entities.push(entity);
        this.dispatchEvent('fill', { name: entity.name });
    }

    /**
     * Get an entity by its name
     * @param {String} name
     * @returns {Model}
     */
    get(name) {
        return this.entities.find(entity => entity.slug === name.toLowerCase());
    }

    /**
     * Get all entities names
     * @returns {String[]}
     */
    get names() {
        return this.entities.map(entity => entity.slug);
    }
}

module.exports = new Library();
