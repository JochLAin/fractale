const InternalProvider = require('./providers/internal');

module.exports = class Table extends InternalProvider {
    constructor(model, provider) {
        super(model);
        this.provider = provider;
    }

    read(uuid) {
        return this.data.get(uuid);
    }

    relayCreate({ item }) {
        if (!this.provider) return;
        this.provider.create(item);
    }

    relayUpdate({ item }) {
        if (!this.provider) return;
        this.provider.update(item);
    }

    relayDelete({ uuid }) {
        if (!this.provider) return;
        this.provider.delete(uuid);
    }

    relayClear({ uuid }) {
        if (!this.provider) return;
        this.provider.clear(uuid);
    }

    setProvider(Provider, options = {}) {
        Object.assign(options, { load: true }, options);
        return new Promise((resolve) => {
            if (this._provider) {
                this.off('create', this.relayCreate.bind(this));
                this.off('update', this.relayUpdate.bind(this));
                this.off('delete', this.relayDelete.bind(this));
                this.off('clear', this.relayClear.bind(this));
            }

            if (!Provider) {
                this._provider = undefined;
            } else {
                this._provider = new Provider(this.model);
            }

            if (!this._provider) resolve();
            else {
                if (!options.load) resolve();
                else {
                    const values = this.provider.values();
                    if (!(values instanceof Promise)) {
                        for (let idx = 0; idx < values.length; idx++) {
                            this.create(values[idx]);
                        }
                        this.on('create', this.relayCreate.bind(this));
                        this.on('update', this.relayUpdate.bind(this));
                        this.on('delete', this.relayDelete.bind(this));
                        this.on('clear', this.relayClear.bind(this));
                        resolve();
                    } else {
                        values.then((values) => {
                            const promises = [];
                            for (let idx = 0; idx < values.length; idx++) {
                                promises.push(this.create(values[idx]));
                            }
                            return Promise.all(promises);
                        }).then(() => {
                            this.on('create', this.relayCreate.bind(this));
                            this.on('update', this.relayUpdate.bind(this));
                            this.on('delete', this.relayDelete.bind(this));
                            this.on('clear', this.relayClear.bind(this));
                            resolve();
                        });
                    }
                }
            }
        });
    }

    get provider() {
        return this._provider;
    }
};
