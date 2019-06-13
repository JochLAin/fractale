
const BaseMemory = require('./base');
const LocalMemory = require('./local');
const PageMemory = require('./page');
const SessionMemory = require('./session');

module.exports = new class Memory {
    constructor() {
        this._types = {
            page: PageMemory,
            local: LocalMemory,
            session: SessionMemory,
        };
        this.type = 'page';
    }

    add(type, memory, setup = true) {
        if (this._types[type]) {
            throw new Error(`Memory ${type} already exists`);
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
        this._types[type] = memory;
        if (setup) this.set(type);
    }

    set(type) {
        if (!this._types[type]) {
            throw new Error(`Memory ${type} doesn't exists.`);
        }
        this.type = type;
    }

    create(name) {
        return new (this._types[this.type])(name);
    }
};

module.exports.BaseMemory = BaseMemory;