
let moment;
try { moment = require('moment'); } catch (error) {}

module.exports = {
    display(value) {
        if (moment) return moment(value).format('DD/MM/YYYY-HH:mm:ss');
        const date = new Date(value);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth()).padStart(2, '0')}/${String(date.getFullYear()).padStart(4, '0')}-${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    },
    format(value) {
        if (moment) return moment(value).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        const date = new Date(value);
        return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth()).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}.${String(date.getMilliseconds()).padStart(3, '0')}Z`;
    },

    is(value) {
        return typeof value === 'string' || value instanceof Date || moment && moment.isMoment(value);
    },
    parse(value) {
        return moment ? moment(value) : new Date(value);
    },

    eq(a, b) {
        if (moment) return moment(a).isSame(b);
        return Math.floor((new Date(a)).getTime() / 1000) === Math.floor((new Date(b)).getTime() / 1000);
    },
    neq(a, b) {
        if (moment) return !moment(a).isSame(b);
        return Math.floor((new Date(a)).getTime() / 1000) !== Math.floor((new Date(b)).getTime() / 1000);
    },
    lt(a, b) {
        if (moment) return moment(a).isBefore(moment(b));
        return Math.floor((new Date(a)).getTime() / 1000) < Math.floor((new Date(b)).getTime() / 1000);
    },
    lte(a, b) {
        if (moment) return moment(a).isSameOrBefore(moment(b));
        return Math.floor((new Date(a)).getTime() / 1000) <= Math.floor((new Date(b)).getTime() / 1000);
    },
    gt(a, b) {
        if (moment) return moment(a).isAfter(moment(b));
        return Math.floor((new Date(a)).getTime() / 1000) > Math.floor((new Date(b)).getTime() / 1000);
    },
    gte(a, b) {
        if (moment) return moment(a).isSameOrAfter(moment(b));
        return Math.floor((new Date(a)).getTime() / 1000) >= Math.floor((new Date(b)).getTime() / 1000);
    },
    between(a, b, c) {
        if (moment) return moment(a).isBetween(b, c);
        return Math.floor((new Date(b)).getTime() / 1000) < Math.floor((new Date(a)).getTime() / 1000)
            && Math.floor((new Date(a)).getTime() / 1000) < Math.floor((new Date(c)).getTime() / 1000)
            ;
    }
};
