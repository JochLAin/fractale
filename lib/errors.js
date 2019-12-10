'use strict';

module.exports.DependencyNotFoundError = class DependencyNotFoundError extends Error {
    constructor(type, name) {
        super();
        this.message = `To use ${type.input.name} field you need to install '${name}' package, please run 'npm install --save ${name}'`;
    }
};
