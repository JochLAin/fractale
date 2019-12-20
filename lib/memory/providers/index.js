const OPT = require('../../options');
const EventListener = require('../../utils/event_listener');
const Ᵽ = require('../../utils/promise');

/**
 * Class that save entity in another place
 *
 * @class Provider
 * @property {String} key - Key formatted with the model slug and prefix_memory option
 * @param {Model} model - Model that provider manage
 * @param {Object} options - Provider options
 */
module.exports = class Provider extends EventListener {
    constructor(model, options = {}) {
        if (new.target === Provider) {
            throw new Error(`Cannot construct Table instances directly`);
        }
        super();
        this.key = Provider.getKey(model);
        this.model = model;
        this.options = options;
    }

    static getKey(model) {
        const prefix = OPT.get('memory_prefix');
        if (!prefix) return model.slug;
        return `${prefix}${model.slug}`;
    }

    ƒ_create(item) {
        return Ᵽ.then(this.create(item), (item) => {
            if (!item) return item;
            this.emit('create', { key: this.model.slug, item });
            return item;
        });
    }

    ƒ_update(item) {
        return Ᵽ.then(this.update(item), (item) => {
            if (!item) return item;
            this.emit('update', { key: this.model.slug, item });
            return item;
        });
    }

    ƒ_delete(uuid) {
        return Ᵽ.then(this.delete(uuid), (result) => {
            if (!result) return result;
            this.emit('delete', { key: this.model.slug, uuid });
            return result;
        });
    }

    ƒ_clear(uuid) {
        return Ᵽ.then(this.clear(uuid), (item) => {
            if (!item) return item;
            this.emit('clear', { key: this.model.slug, item });
            return item;
        });
    }

    /**
     * Save a new entity in another place
     *
     * @param {Model} entity - Entity to save
     */
    create(entity) {
        throw new Error(`Method "create" is not implemented in ${this.constructor.name}`);
    }

    /**
     * Save an existing entity in another place
     *
     * @param {Model} entity - Entity to save
     */
    update(entity) {
        throw new Error(`Method "update" is not implemented in ${this.constructor.name}`);
    }

    /**
     * Delete an existing entity in another place
     *
     * @param {string} uuid - Entity ID
     */
    delete(uuid) {
        throw new Error(`Method "delete" is not implemented in ${this.constructor.name}`);
    }

    /**
     * Clear all values of the other place
     *
     */
    clear() {
        throw new Error(`Method "clear" is not implemented in ${this.constructor.name}`);
    }
};
