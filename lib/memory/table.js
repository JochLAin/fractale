const Provider = require('./providers/internal');

module.exports = class Table extends Provider {
    constructor(model, provider) {
        super(model);
        this.provider = provider;
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

    set provider(Provider) {
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

        if (this._provider) {
            this.on('create', this.relayCreate.bind(this));
            this.on('update', this.relayUpdate.bind(this));
            this.on('delete', this.relayDelete.bind(this));
            this.on('clear', this.relayClear.bind(this));
        }
    }

    get provider() {
        return this._provider;
    }
};
