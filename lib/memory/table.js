const InternalProvider = require('./providers/internal');

/**
 * Class which save data and relay to provider if exists
 *
 * @class Table
 * @extends InternalProvider
 * @param {Model} model - The model that the table manage
 * @param {Provider} provider - The provider used to save data in another place
 */
module.exports = class Table extends InternalProvider {
    constructor(model, provider) {
        super(model);
        this.setProvider(provider);
    }

    /**
     * Get an entity saved by its ID
     *
     * @method read
     * @memberOf Table
     * @param uuid
     * @return {Model|undefined}
     */
    read(uuid) {
        return this.data.get(uuid);
    }

    relayCreate(details) {
        if (!this.provider) return;
        this.provider.create(details.item);
    }

    relayUpdate(details) {
        if (!this.provider) return;
        this.provider.update(details.item);
    }

    relayDelete(details) {
        if (!this.provider) return;
        this.provider.delete(details.uuid);
    }

    relayClear() {
        if (!this.provider) return;
        this.provider.clear();
    }

    /**
     * Set the provider to use and load datas saved inside
     *
     * @method setProvider
     * @memberOf Table
     * @param {Provider} Provider - The provider class to use
     * @param {Object} options - Options passed to provider
     * @return {Promise}
     */
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
            else if (!options.load) resolve();
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
        });
    }

    get provider() {
        return this._provider;
    }
};
