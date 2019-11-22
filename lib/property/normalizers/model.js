const ModelSerializer = require('../serializers/model');
const MixedNormalizer = require('./mixed');

module.exports = class ModelNormalizer extends MixedNormalizer {
    static normalize(field, next, previous) {
        if (!next) return undefined;
        if (typeof next === 'string') return next;
        const memory = field.value.memory;

        if (next.ƒ_uuid) {
            if (!memory.contains(next.uuid)) {
                memory.load(next);
            }
            return next.uuid;
        }

        const props = Object.assign({}, previous && memory.read(previous), next);
        const data = field.deserialize(props);
        return data.uuid;
    }
};
