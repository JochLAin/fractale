### Models

```javascript
const Simple = Fractale.create("Simple", {
    mixed: undefined,
    boolean: Boolean,
    number: Number,
    bigint: BigInt,
    string: String,
    color: Color,
    date: Date,
    regexp: RegExp,
    buffer: ArrayBuffer,
    int8: Int8Array,
    uint8: Uint8Array,
    "uint8_clamped": Uint8ClampedArray,
    int16: Int16Array,
    uint16: Uint16Array,
    int32: Int32Array,
    uint32: Uint32Array,
    float32: Float32Array,
    float64: Float64Array,
    bigint64: BigInt64Array,
    biguint64: BigUint64Array
});
```

### Run

```javascript
const { Simple } = module.exports.get();

const instance = new Simple({
    mixed: 'It\'s dangerous to go alone! Take this.',
    buffer: 'RnJhY3RhbGUgYnVmZmVyIHNhdmU=',
    int8: 'RnJhY3RhbGUgSW50OEFycmF5IHNhdmU=',
    uint8: 'RnJhY3RhbGUgVWludDhBcnJheSBzYXZl',
    uint8_clamped: 'RnJhY3RhbGUgVWludDhDbGFtcGVkQXJyYXkgc2F2ZQ==',
    int16: 'RnJhY3RhbGUgSW50MTZBcnJheSBzYXZl',
    uint16: 'RnJhY3RhbGUgVWludDE2QXJyYXkgdW5pdCB0ZXN0',
    int32: 'RnJhY3RhbGUgSW50MzJBcnJheSB0ZXN0',
    uint32: 'RnJhY3RhbGUgVUludDMyQXJyYXkgdGVzdGluZw==',
    float32: 'RnJhY3RhbGUgRmxvYXQzMkFycmF5IHVuaXRzIHRlc3Q=',
    float64: 'RnJhY3RhbGUgRmxvYXQ2NEFycmF5IHVuaXRzIHRlc3Q=',
    bigint64: 'RnJhY3RhbGUgQmlnSW50NjRBcnJheSB1bml0IHRlc3Q=',
    biguint64: 'RnJhY3RhbGUgQmlnVUludDY0QXJyYXkgdGVzdGluZ3M=',
});

_.test(instance.mixed, 'It\'s dangerous to go alone! Take this.', 'Error on simple accessor with type mixed');
_.test(instance.boolean, false, 'Error on simple accessor with type boolean');
_.test(instance.number, 31, 'Error on simple accessor with type number');
_.test(instance.bigint, 31n, 'Error on simple accessor with type bigint');
_.test(instance.string, 'Lorem ipsum', 'Error on simple accessor with type string');
_.test(instance.color.hex(), '#AA0000', 'Error on simple accessor with type color');
_.test(instance.date.format('DD/MM/YYYY'), '01/01/2000', 'Error on simple accessor with type date');
_.test(instance.regexp.toString(), /toto/g.toString(), 'Error on simple accessor with type bigint');
_.test(base64.encode(instance.buffer), 'RnJhY3RhbGUgYnVmZmVyIHNhdmU=', 'Error on simple accessor with type buffer');
_.test(base64.encode(instance.int8.buffer), 'RnJhY3RhbGUgSW50OEFycmF5IHNhdmU=', 'Error on simple accessor with type int8');
_.test(base64.encode(instance.uint8.buffer), 'RnJhY3RhbGUgVWludDhBcnJheSBzYXZl', 'Error on simple accessor with type uint8');
_.test(base64.encode(instance.uint8_clamped.buffer), 'RnJhY3RhbGUgVWludDhDbGFtcGVkQXJyYXkgc2F2ZQ==', 'Error on simple accessor with type uint8_clamped');
_.test(base64.encode(instance.int16.buffer), 'RnJhY3RhbGUgSW50MTZBcnJheSBzYXZl', 'Error on simple accessor with type int16');
_.test(base64.encode(instance.uint16.buffer), 'RnJhY3RhbGUgVWludDE2QXJyYXkgdW5pdCB0ZXN0', 'Error on simple accessor with type uint16');
_.test(base64.encode(instance.int32.buffer), 'RnJhY3RhbGUgSW50MzJBcnJheSB0ZXN0', 'Error on simple accessor with type int32');
_.test(base64.encode(instance.uint32.buffer), 'RnJhY3RhbGUgVUludDMyQXJyYXkgdGVzdGluZw==', 'Error on simple accessor with type uint32');
_.test(base64.encode(instance.float32.buffer), 'RnJhY3RhbGUgRmxvYXQzMkFycmF5IHVuaXRzIHRlc3Q=', 'Error on simple accessor with type float32');
_.test(base64.encode(instance.float64.buffer), 'RnJhY3RhbGUgRmxvYXQ2NEFycmF5IHVuaXRzIHRlc3Q=', 'Error on simple accessor with type float64');
_.test(base64.encode(instance.bigint64.buffer), 'RnJhY3RhbGUgQmlnSW50NjRBcnJheSB1bml0IHRlc3Q=', 'Error on simple accessor with type bigint64');
_.test(base64.encode(instance.biguint64.buffer), 'RnJhY3RhbGUgQmlnVUludDY0QXJyYXkgdGVzdGluZ3M=', 'Error on simple accessor with type biguint64');

instance.mixed = -1;
instance.boolean = true;
instance.number = 42;
instance.bigint = 42n;
instance.string = 'Dolor sit amet';
instance.color = 'rgba(0, 0, 255, 0)';

_.test(instance.mixed, -1, 'Error on simple accessor with type mixed after change');
_.test(instance.boolean, true, 'Error on simple accessor with type boolean after change');
_.test(instance.number, 42, 'Error on simple accessor with type number after change');
_.test(instance.bigint, 42n, 'Error on simple accessor with type number after change');
_.test(instance.string, 'Dolor sit amet', 'Error on simple accessor with type string after change');
_.test(instance.color.hex(), '#0000FF00', 'Error on simple accessor with type string after change');

resolve(instance);
```

### Results

```json
{
    "uuid": "52cc3c30-842a-4a37-a7a6-8e7c7b50e053",
    "mixed": -1,
    "boolean": true,
    "number": 42,
    "bigint": "42",
    "string": "Dolor sit amet",
    "color": "#0000FF00",
    "date": "2000-01-01T02:00:00.000Z",
    "regexp": "/toto/g",
    "buffer": "RnJhY3RhbGUgYnVmZmVyIHNhdmU=",
    "int8": "RnJhY3RhbGUgSW50OEFycmF5IHNhdmU=",
    "uint8": "RnJhY3RhbGUgVWludDhBcnJheSBzYXZl",
    "uint8_clamped": "RnJhY3RhbGUgVWludDhDbGFtcGVkQXJyYXkgc2F2ZQ==",
    "int16": "RnJhY3RhbGUgSW50MTZBcnJheSBzYXZl",
    "uint16": "RnJhY3RhbGUgVWludDE2QXJyYXkgdW5pdCB0ZXN0",
    "int32": "RnJhY3RhbGUgSW50MzJBcnJheSB0ZXN0",
    "uint32": "RnJhY3RhbGUgVUludDMyQXJyYXkgdGVzdGluZw==",
    "float32": "RnJhY3RhbGUgRmxvYXQzMkFycmF5IHVuaXRzIHRlc3Q=",
    "float64": "RnJhY3RhbGUgRmxvYXQ2NEFycmF5IHVuaXRzIHRlc3Q=",
    "bigint64": "RnJhY3RhbGUgQmlnSW50NjRBcnJheSB1bml0IHRlc3Q=",
    "biguint64": "RnJhY3RhbGUgQmlnVUludDY0QXJyYXkgdGVzdGluZ3M="
}
```