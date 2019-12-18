const OPT = require('../../options');
const EventListener = require('../../utils/event_listener');
const Ᵽ = require('../../utils/promise');

module.exports = class Provider extends EventListener {
    constructor(model, options = {}) {
        if (new.target === Provider) {
            throw new Error(`Cannot construct Table instances directly`);
        }
        super();
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

    create() {
        throw new Error(`Method "create" is not implemented in ${this.constructor.name}`);
    }

    update() {
        throw new Error(`Method "update" is not implemented in ${this.constructor.name}`);
    }

    delete() {
        throw new Error(`Method "delete" is not implemented in ${this.constructor.name}`);
    }

    clear(uuid) {
        if (uuid) return Ᵽ.then(this.delete(uuid));
        return Ᵽ.then(this.keys(), (keys) => {
            return Ᵽ.then(
                keys.map(key => this.delete(key)),
                results => !results.some(result => !result)
            );
        });
    }
};
