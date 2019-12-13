const uuid = require('uuid');
const EventListener = require('./event_listener');
const logger = require('./logger');

class Transaction {
    constructor(queue, handler, title) {
        this.uuid = uuid.v4();
        this.queue = queue;
        this.handler = handler;
        this.title = title || this.uuid;
        this.result = undefined;
        this.error = undefined;
    }

    after() {
        return new Promise((resolve) => {
            this.queue.on('finish', (id) => {
                if (this.uuid === id) {
                    if (this.error) throw this.error;
                    resolve(this.result);
                }
            });
        });
    }
}

module.exports = class Queue extends EventListener {
    constructor() {
        super();
        this.running = false;
        this.txs = [];
    }

    next() {
        logger.debug(`next ${this.txs.length}`);
        if (!this.txs.length) {
            logger.info('end');
            this.running = undefined;
            return;
        }
        const tx = this.txs.shift();
        this.running = tx;
        logger.warn(`start ${tx.title}`);

        tx.handler().then((result) => {
            logger.info(`finish ${tx.title}`);
            tx.result = result;
            this.emit('finish', { id: tx.uuid });
            this.next();
        }).catch(error => {
            tx.error = error;
        });
    }

    run() {
        if (this.running) return;
        this.next();
    }

    push({ title, handler }) {
        const tx = new Transaction(this, handler, title);
        this.txs.push(tx);
        logger.debug(`push ${tx.title}`);
        this.run();
        return tx;
    }
};
