const EventListener = require('../event_listener');
const BaseMemory = require('./base');

let providers = {
    page: require('./page'),
    local: require('./local'),
    session: require('./session'),
};

module.exports = new class Memory extends EventListener {
    constructor() {
        super();
        this.providers = new Map;
        this.provider_type = 'page';
    }

    create(name, ...args) {
        const provider = this.getProvider(name);
        if (!provider) return;
        return provider.create(...args);
    }

    load(name, ...args) {
        const provider = this.getProvider(name);
        if (!provider) return;
        return provider.load(...args);
    }

    read(name, ...args) {
        const provider = this.getProvider(name);
        if (!provider) return;
        return provider.read(...args);
    }

    update(name, ...args) {
        const provider = this.getProvider(name);
        if (!provider) return;
        return provider.update(...args);
    }

    delete(name, ...args) {
        const provider = this.getProvider(name);
        if (!provider) return;
        return provider.delete(...args);
    }

    find(name, ...args) {
        const provider = this.getProvider(name);
        if (!provider) return;
        return provider.find(...args);
    }

    addProvider(name, memory, setup = true) {
        if (providers[name]) {
            throw new Error(`Memory ${name} already exists`);
        }
        if (!(memory.prototype instanceof BaseMemory)) {
            throw new Error('The memory added must extends BaseMemory');
        }
        const methods = [ 'create', 'read', 'update', 'delete', 'find' ];
        for (let index in methods) {
            if (!(memory.prototype[methods[index]] instanceof Function)) {
                throw new Error(`Method ${methods[index]} not found in ${memory.name} class`);
            }
        }
        providers[name] = memory;
        if (setup) this.provider = name;
    }

    createProvider(encyclopedia) {
        const Provider = providers[this.provider_type];

        let provider = this.getProvider(encyclopedia.slug);
        if (provider instanceof Provider) {
            return provider;
        }

        provider = new Provider(this, encyclopedia.slug);
        this.providers.set(encyclopedia, provider);
        return provider;
    }

    getProvider(name) {
        const encyclopedia = require('../library').get(name);
        if (this.providers.has(encyclopedia)) {
            return this.providers.get(encyclopedia);
        }
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