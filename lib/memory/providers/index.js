module.exports = class Provider {
    onCreate() {
        throw new Error(`Provider "${this.constructor.name}" doesn't implements method "create"`);
    }

    onRead() {
        throw new Error(`Provider "${this.constructor.name}" doesn't implements method "read"`);
    }

    onUpdate() {
        throw new Error(`Provider "${this.constructor.name}" doesn't implements method "update"`);
    }

    onDelete() {
        throw new Error(`Provider "${this.constructor.name}" doesn't implements method "delete"`);
    }

    onFind() {
        throw new Error(`Provider "${this.constructor.name}" doesn't implements method "find"`);
    }
};
