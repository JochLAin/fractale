const EventListener = require('../../utils/event_listener');

module.exports = class Storage extends EventListener {
    constructor(name) {
        super();
        this.name = name;
    }
};
