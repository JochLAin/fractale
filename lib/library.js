
const EventListener = require('./event_listener');

class Library extends EventListener {
    constructor() {
        super();
        this.encyclopedias = [];
    }

    all(with_virtual = false) {
        if (with_virtual) {
            return this.encyclopedias;
        }
        return this.encyclopedias.filter(e => !e.virtual);
    }

    fill(name, schema, model, virtual) {
        const encyclopedia = new Encyclopedia(name, schema, model, virtual);
        this.encyclopedias.push(encyclopedia);
        this.dispatchEvent('fill', { name });
    }

    get(name) {
        if (!this.names.includes(name.toLowerCase())) {
            return false;
            // throw new Error(`Model with name "${name}" doesn't exists.`);
        }
        return this.encyclopedias.find(encyclopedia => encyclopedia.name === name.toLowerCase());
    }

    read(data) {
        if (!data || !Array.isArray(data)) {
            data = [];
        }
        this.encyclopedias = data;
    }

    get names() {
        return this.encyclopedias.map(encyclopedia => encyclopedia.name);
    }

    // set socket(socket) {
    //     this._socket = socket;
    // }

    // get socket() {
    //     return this._socket;
    // }
}

class Encyclopedia extends EventListener {
    constructor(name, schema, model, virtual) {
        super();
        this.name = name.toLowerCase();
        this.schema = Object(schema);
        this.model = model;
        this.virtual = virtual;
        this.instances = [];
    }

    set(instance) {
        const index = this.instances.findIndex(i => i.uuid === instance.uuid);
        if (index < 0) {
            this._instances.push(instance);
        } else {
            this._instances.splice(index, 1, instance);
        }
    }

    get(uuid) {
        return this.instances.find(instance => {
            return instance.uuid === uuid
        });
    }

    set name(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set schema(schema) {
        this._schema = schema;
    }

    get schema() {
        return this._schema;
    }

    set model(model) {
        this._model = model;
    }

    get model() {
        return this._model;
    }

    set virtual(virtual) {
        this._virtual = virtual;
    }

    get virtual() {
        return this._virtual;
    }

    set instances(instances) {
        this._instances = instances;
    }

    get instances() {
        return this._instances;
    }
}

const library =  new Library();
module.exports = library;