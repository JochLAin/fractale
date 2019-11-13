const uuid = require('uuid');
const Model = require('./model');

/**
 * Default schema class
 * @class Schema
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class Schema {
    constructor(props, parent) {
        this._uuid = props.uuid || uuid.v4();
        this.props = props;
        if (parent instanceof Schema) {
            this.parent = parent;
        } else if (parent instanceof Model) {
            this.parent = parent.schema;
        }
    }

    get current() {
        return this._props;
    }

    set props(props) {
        return this._props = props;
    }

    get props() {
        return Object.assign({}, this.parent, this._props);
    }

    get uuid() {
        return this._uuid;
    }
};
