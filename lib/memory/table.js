'use strict';

const InternalTable = require('./providers/internal');

module.exports = class Table extends InternalTable {
    onCreateRelayProvider({ item }) {
        if (!this._provider) return;
        this._provider.create(item);
    }

    onUpdateRelayProvider({ item }) {
        if (!this._provider) return;
        this._provider.update(item);
    }

    onDeleteRelayProvider({ item }) {
        if (!this._provider) return;
        this._provider.delete(item);
    }

    set provider(Provider) {
        if (this._provider) {
            this.removeEventListener('create', this.onCreateRelayProvider.bind(this));
            this.removeEventListener('update', this.onUpdateRelayProvider.bind(this));
            this.removeEventListener('delete', this.onDeleteRelayProvider.bind(this));
        }

        if (!Provider) {
            this._provider = undefined;
        } else {
            this._provider = new Provider(this.model);
        }

        if (this._provider) {
            this.addEventListener('create', this.onCreateRelayProvider.bind(this));
            this.addEventListener('update', this.onUpdateRelayProvider.bind(this));
            this.addEventListener('delete', this.onDeleteRelayProvider.bind(this));
        }
    }

    get provider() {
        return this._provider;
    }
};
