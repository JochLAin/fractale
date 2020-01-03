const library = require('../library');
const EventListener = require('../utils/event_listener');
const idb = require('../utils/storage/idb');
const Provider = require('./providers');
const Table = require('./table');

const providers = {
    cookie: require('./providers/cookie'),
    idb: require('./providers/idb'),
    local: require('./providers/local'),
    session: require('./providers/session'),
};

/**
 * Memory which manage save of an entity into stores
 *
 * @class Memory
 * @property {Map} tables - Map of tables with key, the model, and value, the table
 * @property {Function|undefined} provider - The provider class to use
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
class Memory extends EventListener {
    constructor() {
        super();
        this.tables = new Map();
    }

    /**
     * Create a Table from a model
     *
     * @param model
     * @return {Table|undefined}
     */
    createTable(model) {
        if (!model.ƒ_model) {
            throw new Error(`Expected Model as parameter, got ${typeof model}`);
        }
        let table = this.getTable(model);
        if (table instanceof Table) return table;

        table = new Table(model, this.provider);
        this.tables.set(model, table);
        return table;
    }

    /**
     * Get a table by model or model's name
     *
     * @param {Model|String} model - the model or its name
     * @return {Table|undefined}
     */
    getTable(model) {
        if (typeof model === 'string') model = library.get(model);
        if (!model) return;
        if (!this.tables.has(model)) return;
        return this.tables.get(model);
    }

    /**
     * Get a table by model or model's name
     *
     * @param {Function|String} provider - provider to use or its shortname
     * @param {Object} options - options to passed to provider
     * @return {Table|undefined}
     */
    setProvider(provider, options = {}) {
        return new Promise((resolve) => {
            if (!provider) provider = undefined;
            else {
                if (typeof provider === 'string') {
                    if (!providers[provider]) {
                        throw new Error(`Provider ${provider} doesn't exists`);
                    }
                    provider = providers[provider];
                }
                if (!(provider instanceof Function) || !provider.constructor) {
                    throw new Error(`Provider passed is not a class`);
                }
                if (!(provider.prototype instanceof Provider)) {
                    throw new Error(`Provider ${provider.constructor.name} is not a Fractale.Provider`);
                }
            }

            if (!provider && !this._provider) resolve();
            else {
                this._provider = provider;

                const promises = [];
                for (let idx = 0, keys = Array.from(this.tables.keys()); idx < keys.length; idx++) {
                    promises.push(this.tables.get(keys[idx]).setProvider(provider, options));
                }

                return Promise.all(promises).then(resolve);
            }
        });
    }

    get provider() {
        return this._provider;
    }

    /**
     * Shortcut to create method of a table
     *
     * @param {Model|String} entity - The key of the table
     * @param {Model} item - Entity to save
     * @return {Promise<Model>|Model|undefined}
     */
    create(entity, item) {
        const table = this.getTable(entity);
        if (!table) return;
        return table.ƒ_create(item);
    }

    /**
     * Shortcut to read method of a table
     *
     * @param {Model|String} entity - The key of the table
     * @param {String} uuid - ID of the entity to read
     * @return {Promise<Model>|Model|undefined}
     */
    read(entity, uuid) {
        const table = this.getTable(entity);
        if (!table) return;
        return table.read(uuid);
    }

    /**
     * Shortcut to update method of a table
     *
     * @param {Model|String} entity - The key of the table
     * @param {Model} item - Entity to save
     * @return {Promise<Model>|Model|undefined}
     */
    update(entity, item) {
        const table = this.getTable(entity);
        if (!table) return;
        return table.ƒ_update(item);
    }

    /**
     * Shortcut to delete method of a table
     *
     * @param {Model|String} entity - The key of the table
     * @param {String} uuid - ID of the entity to delete
     * @return {Promise<Model>|Model|undefined}
     */
    delete(entity, uuid) {
        const table = this.getTable(entity);
        if (!table) return;
        return table.ƒ_delete(uuid);
    }

    /**
     * Shortcut to clear method of a table
     *
     * @param {Model|String} entity - The key of the table
     */
    clear(entity) {
        if (entity) {
            const table = this.getTable(entity);
            if (!table) return;
            return table.ƒ_clear();
        }
        if (this.provider === providers.idb) {
            idb('ƒ_database', library.names).deleteDatabase();
        } else {
            for (let index = 0, keys = Array.from(this.tables.keys()), length = keys.length; index < length; index++) {
                if (!this.tables.get(keys[index]).ƒ_clear()) return false;
            }
        }
        return true;
    }
}

module.exports = new Memory();
