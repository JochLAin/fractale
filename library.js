
class Library {
    constructor() {
        this.encyclopedias = [];
    }

    all() {
        return this.encyclopedias;
    }

    fill(name, schema) {
        const encyclopedia = new Encyclopedia(name, schema);
        this.encyclopedias.push(encyclopedia);
    }

    get(name) {
        if (!this.names.includes(name.toLowerCase())) {
            throw new Error(`Model with name "${name}" doesn't exists.`);
        }
        return this.encyclopedias.find(encyclopedia => encyclopedia.name == name.toLowerCase());
    }

    get names() {
        return this.encyclopedias.map(encyclopedia => encyclopedia.name);
    }
}

class Encyclopedia {
    constructor(name, schema) {
        this.name = name.toLowerCase();
        this.schema = Object(schema);
        this.instances = [];
    }

    set(instance) {
        const index = this.instances.findIndex(i => i.uuid == instance.uuid);
        if (index < 0) {
            this._instances.push(instance);
        } else {
            this._instances.splice(index, 1, instance);
        }
    }

    get(uuid) {
        return this.instances.find(instance => {
            return instance.uuid == uuid
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

    set instances(instances) {
        this._instances = instances;
    }

    get instances() {
        return this._instances;
    }
}

const library =  new Library();
module.exports = library;