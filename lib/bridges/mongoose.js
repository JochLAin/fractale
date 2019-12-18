const Bridge = require('./index');
let mongoose;

module.exports = class MongooseBridge extends Bridge {
    constructor() {
        super('Mongoose');
    }

    export(model) {
        if (!mongoose) mongoose = require('mongoose');
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
};
