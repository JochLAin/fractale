const EventListener = require('./event_listener');
const Memory = require('./memory');

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
        this.memories = new Map();
    }

    /**
     * Get all entities
     * @param {Boolean} with_virtual - Specify if auto-generated models must be included
     * @returns {ModelClass[]}
     */
    all(with_virtual = false) {
        if (with_virtual) {
            return this.entities;
        }
        return this.entities.filter(entity => !entity.virtual);
    }

    /**
     * Add new entity to library
     * @param {ModelClass} entity - Model class
     */
    add(entity) {
        this.entities.push(entity);
        Memory.createTable(entity);
        this.dispatchEvent('fill', { name: entity.name });
    }

    /**
     * Get an entity by its name
     * @param {String} name
     * @returns {ModelClass}
     */
    get(name) {
        return this.entities.find(entity => entity.slug === name.toLowerCase());
    }

    register(instance, params) {
        const memory = Memory.getTable(instance.constructor.name);
        memory.load(instance.serialize(false));
        if (!params.uuid) memory.create(instance.serialize(false));
        instance.addEventListener('change', ({ value, previous }) => {
            if (value !== previous) {
                memory.update(instance.serialize(false));
            }
        });
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
