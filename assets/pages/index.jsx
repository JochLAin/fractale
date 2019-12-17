const Fractale = require('../../lib');
const logger = require('crieur');
logger.level = 2;

window.Fractale = Fractale;

/** Global testing */
// Promise.resolve()
//     .then(() => logger.warn('Run test for SessionStorage provider'))
//     .then(() => Fractale.memory.setProvider('session'))
//     .then(() => Fractale.memory.clear())
//     .then(() => require('../../tests/index').run())
//
//     .then(() => logger.warn('Run test for LocalStorage provider'))
//     .then(() => Fractale.memory.setProvider('local'))
//     .then(() => Fractale.memory.clear())
//     .then(() => require('../../tests/index').run())
//
//     .then(() => logger.warn('Run test for Cookie provider'))
//     .then(() => Fractale.memory.setProvider('cookie'))
//     .then(() => Fractale.memory.clear())
//     .then(() => require('../../tests/index').run())
//
//     .then(() => logger.warn('Run test for IndexedDB provider'))
//     .then(() => Fractale.memory.setProvider('idb'))
//     .then(() => Fractale.memory.clear())
//     .then(() => require('../../tests/index').run())
// ;

/** Testing load */
// const Sample = Fractale.create('Sample', {
//     value: String,
// });
//
// Promise.resolve().then(() => {
//     return Fractale.memory.setProvider('idb');
// }).then(() => {
//     return Fractale.memory.clear();
// }).then(() => {
//     new Sample({ value: 'Hello' });
//     new Sample({ value: 'world' });
// }).then(() => {
//     return Fractale.memory.setProvider(undefined);
// }).then(() => {
//     return Fractale.memory.clear();
// }).then(() => {
//     return Sample.memory.values();
// }).then((values) => {
//     console.log(values);
// }).then(() => {
//     return Fractale.memory.setProvider('idb');
// }).then(() => {
//     return Sample.memory.values();
// }).then((values) => {
//     console.log(values);
// });
