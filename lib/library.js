const EventListener = require('./event_listener');
const memory = require('./memory');
const Schema = require('./schema');

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
        this.models = [];
        this.schemas = [];
    }

    /**
     * Get all models
     * @param {Boolean} with_virtual - Specify if auto-generated models must be included
     * @returns {ModelClass[]}
     */
    all(with_virtual = false) {
        if (with_virtual) {
            return this.models;
        }
        return this.models.filter(model => !model.virtual);
    }

    /**
     * Add new model to library
     * @param {ModelClass|Schema} model - Model class
     */
    add(model) {
        if (model instanceof Schema) {
            this.schemas.push(model);
        } else {
            this.models.push(model);
            memory.createTable(model);
            this.dispatchEvent('fill', { name: model.name });
        }
    }

    /**
     * Get an model by its name
     * @param {String} name
     * @returns {ModelClass}
     */
    get(name) {
        return this.models.find(model => model.slug === name.toLowerCase());
    }

    /**
     * Register an instance of a model
     * @param {ModelClass} instance
     * @param {Object} params
     * @returns {ModelClass}
     */
    register(instance, params) {
        const memory = memory.getTable(instance.constructor.name);
        memory.load(instance.serialize(false));
        if (!params.uuid) memory.create(instance.serialize(false));
        instance.addEventListener('change', ({ value, previous }) => {
            if (value !== previous) {
                memory.update(instance.serialize(false));
            }
        });

        return instance;
    }

    /**
     * Get all models names
     * @returns {String[]}
     */
    get names() {
        return this.models.map(model => model.slug);
    }
}

module.exports = new Library();
