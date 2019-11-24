const Base = require('./base');
let Model = Base;

module.exports.set = (_Model) => {
    if (!(_Model === Model || _Model.prototype instanceof Base)) {
        throw new Error('Your model class must inherit "Fractale.Model" class');
    }
    Model = _Model;
};

module.exports.get = () => Model;
