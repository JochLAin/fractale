module.exports = class Provider {
    onCreate(entity, item) {
        throw new Error(`Provider "${this.constructor.name}" doesn't implements method "onCreate"`);
    }

    onUpdate(entity, item) {
        throw new Error(`Provider "${this.constructor.name}" doesn't implements method "onUpdate"`);
    }

    onDelete(entity, item) {
        throw new Error(`Provider "${this.constructor.name}" doesn't implements method "onDelete"`);
    }
};
