const EventListener = require('../event_listener');
const BaseMemory = require('./providers/base');

let providers = {
    page: require('./providers/page'),
    local: require('./providers/local'),
    session: require('./providers/session'),
};

module.exports = new class Memory extends EventListener {
    constructor() {
        super();
        this.tables = new Map;
        this.provider_type = 'page';
    }

    create(name, ...args) {
        const provider = this.getTable(name);
        if (!provider) return;
        return provider.create(...args);
    }

    load(name, ...args) {
        const provider = this.getTable(name);
        if (!provider) return;
        return provider.load(...args);
    }

    read(name, ...args) {
        const provider = this.getTable(name);
        if (!provider) return;
        return provider.read(...args);
    }

    update(name, ...args) {
        const provider = this.getTable(name);
        if (!provider) return;
        return provider.update(...args);
    }

    delete(name, ...args) {
        const provider = this.getTable(name);
        if (!provider) return;
        return provider.delete(...args);
    }

    find(name, ...args) {
        const provider = this.getTable(name);
        if (!provider) return;
        return provider.find(...args);
    }

    addProvider(name, memory, setup = false) {
        if (providers[name]) {
            throw new Error(`Memory ${name} already exists`);
        }
        if (!(memory.prototype instanceof BaseMemory)) {
            throw new Error('The memory added must extends BaseMemory');
        }
        const methods = [ 'onCreate', 'onRead', 'onUpdate', 'onDelete', 'onFind' ];
        for (const index in methods) {
            if (methods.hasOwnProperty(index)) {
                if (!(memory.prototype[methods[index]] instanceof Function)) {
                    throw new Error(`Method ${methods[index]} not found in ${memory.name} class`);
                }
            }
        }
        providers[name] = memory;
        if (setup) this.provider = name;
    }

    createTable(entity) {
        let table = this.getTable(entity.slug);
        if (table instanceof this.provider) {
            return table;
        }

        table = new this.provider(this, entity);
        this.tables.set(entity, table);
        return table;
    }

    getTable(name) {
        const entity = require('../library').get(name);
        if (this.tables.has(entity)) {
            return this.tables.get(entity);
        }
    }

    get provider() {
        return providers[this.provider_type];
    }

    set provider(name) {
        if (!providers[name]) {
            throw new Error(`Memory ${name} doesn't exists.`);
        }
        this.provider_type = name;

        const encyclopedias = [...this.providers.keys()];
        for (let index in encyclopedias) {
            encyclopedias[index].memory = this.createProvider(encyclopedias[index]);
        }
    }
};

module.exports.BaseMemory = BaseMemory;
