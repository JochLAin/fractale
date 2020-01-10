const Bridge = require('./index');
let mongoose;
try { mongoose = require('mongoose'); }
catch (error) {}

/**
 * Mongoose bridge that transform model into mongoose model
 * @class MongooseBridge
 * @extends Bridge
 *
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
class MongooseBridge extends Bridge {
    constructor() {
        super('Mongoose');
    }

    export(model) {
        return mongoose.model(model.name, Object.assign({},
            { _id: String, uuid: String },
            model.schema.toBasic((value, type) => {
                if (!value) {
                    return mongoose.Schema.Types.Mixed;
                } else if (value === Object) {
                    if (type.generator === model) {
                        return { type: String, ref: type.generator.name };
                    }
                    if (!mongoose.modelNames().includes(type.generator.name)) {
                        this.export(type.generator);
                    }
                    return { type: String, ref: type.generator.name };
                } else if (value === BigInt) {
                    return mongoose.Schema.Types.Decimal128;
                }
                return value;
            }),
        ));
    };
}

module.exports = MongooseBridge;
