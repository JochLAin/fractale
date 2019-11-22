/**
 * @class
 */
module.exports = class MixedSerializer {
    /**
     * Deserialize the value
     * @param {Field} field
     * @param {*} value
     * @param {Object} options
     * @returns {*}
     */
    static deserialize(field, value) {
        return value || undefined;
    }

    /**
     * Normalize the value
     * @param {Field} field
     * @param {*} value
     * @param {Object} options
     * @returns {*}
     * @method
     */
    static serialize(field, value, options = {}) {
        return value || undefined;
    }
};
