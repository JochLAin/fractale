<article class="mb-4"><a href="#models" class="border border-1" data-toggle="collapse">Models used for examples</a><div id="models" class="border border-1 collapse">

```javascript
const Simple = Fractale.create("Simple", {
    mixed: undefined,
    boolean: Boolean,
    number: Number,
    string: String,
    date: Date
});
```

</div></article>

```javascript
const instance = new Simple({
    mixed: 'It\'s dangerous to go alone! Take this.',
    boolean: false,
    number: 31,
    string: 'Lorem ipsum'
});

if (instance.mixed !== 'It\'s dangerous to go alone! Take this.') {
    throw new DetailedError('Error on simple accessor with type mixed', `Expected "It's dangerous to go alone! Take this." got "${instance.mixed}"`);
}
if (instance.boolean !== false) {
    throw new DetailedError('Error on simple accessor with type boolean', `Expected "false" got "${instance.boolean}"`);
}
if (instance.number !== 31) {
    throw new DetailedError('Error on simple accessor with type number', `Expected "31" got "${instance.number}"`);
}
if (instance.string !== 'Lorem ipsum') {
    throw new DetailedError('Error on simple accessor with type string', `Expected "Lorem ipsum" got "${instance.string}"`);
}

instance.mixed = -1;
instance.boolean = true;
instance.number = 42;
instance.string = 'Dolor sit amet';

if (instance.mixed !== -1) {
    throw new DetailedError('Error on simple accessor with type mixed after change', `Expected "-1" got "${instance.mixed}"`);
}
if (instance.boolean !== true) {
    throw new DetailedError('Error on simple accessor with type boolean after change', `Expected "true" got "${instance.boolean}"`);
}
if (instance.number !== 42) {
    throw new DetailedError('Error on simple accessor with type number after change', `Expected "42" got "${instance.number}"`);
}
if (instance.string !== 'Dolor sit amet') {
    throw new DetailedError('Error on simple accessor with type string after change', `Expected "Dolor sit amet" got "${instance.string}"`);
}

resolve(instance);
```

### Results

```json
{
    "uuid": "614a08d1-faf0-45fc-b238-0817cc9963f6",
    "mixed": -1,
    "boolean": true,
    "number": 42,
    "string": "Dolor sit amet"
}
```