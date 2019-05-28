
const EventListener = require('./event_listener');

/**
 * Model storage manager
 *
 * @class Library
 * @extends EventListener
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
class Library extends EventListener {
    constructor() {
        super();
        this.encyclopedias = [];
    }

    /**
     * Get all encyclopedias
     * @param {Boolean} with_virtual - Specify if auto-generated models must be included
     * @returns {Encyclopedia[]}
     */
    all(with_virtual = false) {
        if (with_virtual) {
            return this.encyclopedias;
        }
        return this.encyclopedias.filter(e => !e.virtual);
    }

    /**
     * Add new encyclopedia to library
     * @param {String} name - Model name
     * @param {Object} schema - Model schema
     * @param {ModelClass} model - Model class
     * @param {Boolean} virtual - Specify if is auto-generated class
     */
    fill(name, schema, model, virtual) {
        const encyclopedia = new Encyclopedia(this, name, schema, model, virtual);
        this.encyclopedias.push(encyclopedia);
        this.dispatchEvent('fill', { name });
    }

    /**
     * Get an encyclopedia by its name
     * @param {String} name
     * @returns {Encyclopedia}
     */
    get(name) {
        if (!this.names.includes(name.toLowerCase())) {
            return false;
            // throw new Error(`Model with name "${name}" doesn't exists.`);
        }
        return this.encyclopedias.find(encyclopedia => encyclopedia.name === name.toLowerCase());
    }

    /**
     * Fill library with data serialized
     * @param {Object} data
     */
    read(data) {
        if (!data || !Array.isArray(data)) {
            data = [];
        }
        this.encyclopedias = data;
    }

    /**
     * Get all encyclopedias names
     * @returns {String[]}
     */
    get names() {
        return this.encyclopedias.map(encyclopedia => encyclopedia.name);
    }
}

/**
 * Class that store models
 * @class Encyclopedia
 * @param {Library} library - Library attached to encyclopedia
 * @param {String} name - Model name
 * @param {Object} schema - Model schema
 * @param {ModelClass} model - Model class
 * @param {Boolean} virtual - Specify if is auto-generated class
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
class Encyclopedia extends EventListener {
    constructor(library, name, schema, model, virtual) {
        super();
        this.library = library;
        this.name = name.toLowerCase();
        this.schema = Object(schema);
        this.model = model;
        this.virtual = virtual;
        this.instances = [];
    }

    /**
     * Add or update instance
     * @param {ModelClass} instance - Instance of ModelClass
     */
    set(instance) {
        const index = this.instances.findIndex(i => i.uuid === instance.uuid);
        if (index < 0) {
            this._instances.push(instance);

            this.dispatchEvent('create', { instance });
            this.library.dispatchEvent('create', { name: this.name, instance });
        } else {
            this._instances.splice(index, 1, instance);
        }
    }

    /**
     * Get an instance of the model by uuid
     * @param {String} uuid - Model instance identifier
     * @returns {ModelClass}
     */
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