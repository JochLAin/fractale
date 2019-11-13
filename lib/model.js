const uuid = require('uuid');
const EventListener = require('./event_listener');

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
};
