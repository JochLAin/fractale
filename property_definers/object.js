

const BasicPropertyDefiner = require('./basic');

class ObjectPropertyDefiner extends BasicPropertyDefiner {
    constructor(instance, key, type, options) {
        super(instance, key, type, options);
        this.items = {};
        // for (let _key in this.type) {
        //     this.items[_key] = new ItemPropertyDefiner(
        //         this.instance,
        //         _key,
        //         this.type[_key],
        //         undefined,
        //         this.key
        //     );
        // }
    }

    assign() {
        this.instance[`_${this.key}`] = {};
    }

    check(value) {
        if (!['object'].includes(typeof value)) {
            throw BasicPropertyDefiner.createUncorrectTypeError(this, value, 'object');
        }
    }

    define() {
        Object.defineProperty(this.instance, this.key, {
            get: this.getter(),
            set: this.setter(),
        });
        for (let _key in this.type) {
            const definer = new ItemPropertyDefiner(this.instance, _key, this.type[_key], undefined, this.key);
            definer.define();
        }
    }

    normalize(value) {
        return Object.assign({}, this.instance[`_${this.key}`], value === null ? null : Object(value));
    }

    denormalize(value) {
        return value === null ? null : Object(value);
    }
}

class ItemPropertyDefiner extends BasicPropertyDefiner {
    constructor(instance, key, type, options, parent_key) {
        super(instance, key, type, options);
        this.parent_key = parent_key;
        this.subdefiner = require('./index').get(
            this.instance,
            this.singular,
            this.type
        );
    }

    check(value) {
        this.subdefiner.check(value);
    }

    define() {
        Object.defineProperty(this.instance, `${this.parent_key}_${this.key}`, {
            get: this.getter(),
            set: this.setter(),
        });
    }

    getter() {
        return () => {
            return this.denormalize(this.instance[this.parent_key][this.key]);
        };
    }

    setter() {
        return (value) => {
            this.check(value);
            this.instance[this.parent_key][this.key] = this.normalize(value);
            this.instance.dispatchEvent('change');
        };
    }

    normalize(value) {
        return this.subdefiner.normalize(value)
    }

    denormalize(value) {
        return this.subdefiner.denormalize(value);
    }
}

module.exports = ObjectPropertyDefiner;