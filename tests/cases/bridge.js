const Fractale = require('../../lib');
const _ = require('../utils');

module.exports.title = 'Mongoose bridge tests';
module.exports.name = 'bridge_mongoose';
module.exports.tutorialized = false;

module.exports.resolver = (resolve) => {
    const { BridgeModel } = module.exports.get();
    BridgeModel.toMongoose();
    BridgeModel.toPropTypes();
    resolve();
};

module.exports.create = () => {
    const BridgeModel = Fractale.create('BridgeModel', {
        mixed: undefined,
        boolean: false,
        number: 31,
        bigint: 31n,
        string: 'Lorem ipsum',
        color: '#AA0000',
        date: Fractale.with(Date, { default: '2000-01-01' }),
        regexp: '/toto/g',
        buffer: ArrayBuffer,
        int8: Int8Array,
        uint8: Uint8Array,
        uint8_clamped: Uint8ClampedArray,
        int16: Int16Array,
        uint16: Uint16Array,
        int32: Int32Array,
        uint32: Uint32Array,
        float32: Float32Array,
        float64: Float64Array,
        bigint64: BigInt64Array,
        biguint64: BigUint64Array,
        boards: [String],
        metadata: {
            key: String,
            data: {
                key: String,
                value: undefined
            }
        },
    });
    return { BridgeModel };
};

let models;
module.exports.get = () => {
    if (models) return models;
    return models = module.exports.create();
};

module.exports.used = () => {
    return module.exports.get().BridgeModel;
};
