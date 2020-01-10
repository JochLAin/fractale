const Bridge = require('./index');
let PropTypes;
try { PropTypes = require('prop-types'); }
catch (error) {}

/**
 * PropTypes bridge that transform model into PropTypes object
 * @class PropTypesBridge
 * @extends Bridge
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
class PropTypeBridge extends Bridge {
    constructor() {
        super('PropTypes');
    }

    export(model, options = {}, depth = 512) {
        return PropTypes.oneOfType([
            PropTypes.instanceOf(model),
            PropTypes.shape(Object.assign({},
                { uuid: PropTypes.string },
                model.schema.toBasic((value, type) => {
                    const checker = this.getTypeChecker(model, value, type, options, depth);
                    if (!type.options.required) return checker;
                    return checker.isRequired;
                }),
            ))
        ]);
    };

    getTypeChecker(model, value, type, options, depth) {
        switch (value) {
            case Boolean: return PropTypes.bool;
            case Number: return PropTypes.number;
            case String: return PropTypes.string;
            case BigInt: return PropTypes.instanceOf(BigInt);
            case Date: return PropTypes.instanceOf(Date);
            case Object:
                if (Array.isArray(value)) return PropTypes.arrayOf(value[0]);
                return this.export(type.generator, options, depth - 1);
            default: return PropTypes.any;
        }
    };
}

module.exports = PropTypeBridge;
