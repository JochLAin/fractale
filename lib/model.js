const uuid = require('uuid');
const EventListener = require('./event_listener');
const { FIELD_TYPE_MIXED, FIELD_TYPE_BOOLEAN, FIELD_TYPE_NUMBER, FIELD_TYPE_STRING, FIELD_TYPE_DATE } = require('./constants');

/**
 * Default base model class
 * @class Model
 * @extends EventListener
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class Model extends EventListener {
    constructor(props) {
        super();
        this._uuid = props.uuid || uuid.v4();
        this._props = {};
    }

    get props() {
        return this._props;
    }

    set props(props) {
        this.deserialize(props);
        return props;
    }

    get uuid() {
        return this._uuid;
    }

    static stringify(model, space) {
        const parent = model.schema.parent;
        const replacer = (key, value) => {
            switch (value) {
                case FIELD_TYPE_MIXED:
                    return 'undefined';
                case FIELD_TYPE_BOOLEAN:
                    return 'Boolean';
                case FIELD_TYPE_NUMBER:
                    return 'Number';
                case FIELD_TYPE_STRING:
                    return 'String';
                case FIELD_TYPE_DATE:
                    return 'Date';
            }
            return value || 'undefined';
        };
        const schema = JSON.stringify(model.schema, replacer, space).replace(/("([a-zA-Z0-9\-_.]+)":?)/g, (match, content, value) => {
            if (!content.match(/:$/)) return value;
            if (value.match(/^[a-zA-Z0-9]+$/)) return `${value}:`;
            return content;
        });
        return `const ${model.name} = Fractale.create("${model.name}", ${parent ? `${parent.name}, ` : ''}${schema});`;
    }
};
