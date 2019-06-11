
const Fractale = require('./index');
const EventListener = require('./event_listener');
const library = require('./library');

/**
 * Default base model class
 * @class ModelClass
 * @extends EventListener
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
const ModelClass = module.exports = class ModelClass extends EventListener {
    constructor(props) {
        super();
        this.props = props;
    }

    toString() {
        const loop = (schema) => {
            const single = (value) => {
                switch (value) {
                    case null: return "mixed";
                    case undefined: return "mixed";
                    case Boolean: return "Boolean";
                    case Number: return "Number";
                    case String: return "String";
                    case Fractale.SELF: return "Fractale.SELF";
                    default:
                        if (Array.isArray(value)) {
                            return [single(value[0])];
                        }
                        if (value.prototype instanceof ModelClass) {
                            return value.name;
                        }
                        return loop(value);
                }
            };

            return Object.keys(schema).reduce((accu, key) => {
                return Object.assign({}, accu, {
                    [key]: single(schema[key])
                });
            }, {});
        };

        return JSON.stringify(loop(this.schema));
    }
};
