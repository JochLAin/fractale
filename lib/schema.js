const uuid = require('uuid');
const { TYPE_KEY, OPTIONS_KEY } = require('./constants');

/**
 * Schema class
 * @class Schema
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
module.exports = class Schema {
    constructor(props = {}, parent) {
        if (props.uuid) {
            throw new Error('Field "uuid" is automatically set');
        }

        this.uuid = uuid.v4();
        this.parent = parent;
        this.props = {};
        for (let key in props) {
            if (props.hasOwnProperty(key)) {
                let type, options;
                if (typeof props[key] === 'object' && props[key][TYPE_KEY]) {
                    type = props[key][TYPE_KEY];
                    options = props[key][OPTIONS_KEY];
                } else {
                    type = props[key];
                }
                Object.assign(this.props, {
                    [key]: new Field(key, type, options),
                });
            }
        }
    }

    get value() {
        return Object.assign({}, this.parent, this.props);
    }
};

class Field {
    constructor(name, type, options = {}) {
        this.name = name;
        this.type = type;
        this.options = options;
    }
}
