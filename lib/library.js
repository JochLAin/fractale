'use strict';

const EventListener = require('./event_listener');

/**
 * Model storage manager
 *
 * @class Library
 * @extends EventListener
 * @member {Model[]} models - All models
 * @member {String[]} names - All models keys
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
class Library extends EventListener {
    constructor() {
        super();
        this.models = [];
    }

    /**
     * Get all models
     * @param {Boolean} with_virtual - Specify if auto-generated models must be included
     * @returns {Model[]}
     */
    all(with_virtual = false) {
        if (with_virtual) {
            return this.models;
        }
        return this.models.filter(model => !model.virtual);
    }

    /**
     * Add new model to library
     * @param {Model} model - Model class
     */
    add(model) {
        this.models.push(model);
        this.dispatchEvent('add', { name: model.name });
    }

    /**
     * Get an model by its name
     * @param {String} name
     * @returns {Model}
     */
    get(name) {
        return this.models.find(model => model.slug === name.toLowerCase());
    }

    get names() {
        return this.models.map(model => model.slug);
    }
}

module.exports = new Library();
