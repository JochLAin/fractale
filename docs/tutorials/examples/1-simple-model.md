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
const { Simple } = module.exports.get();
const instance = new Simple({
    mixed: 'It\'s dangerous to go alone! Take this.',
    boolean: false,
    number: 31,
    string: 'Lorem ipsum',
    date: '2000-01-01',
});

_.test(instance.mixed, 'It\'s dangerous to go alone! Take this.', 'Error on simple accessor with type mixed');
_.test(instance.boolean, false, 'Error on simple accessor with type boolean');
_.test(instance.number, 31, 'Error on simple accessor with type number');
_.test(instance.string, 'Lorem ipsum', 'Error on simple accessor with type string');

instance.mixed = -1;
instance.boolean = true;
instance.number = 42;
instance.string = 'Dolor sit amet';

_.test(instance.mixed, -1, 'Error on simple accessor with type mixed after change');
_.test(instance.boolean, true, 'Error on simple accessor with type boolean after change');
_.test(instance.number, 42, 'Error on simple accessor with type number after change');
_.test(instance.string, 'Dolor sit amet', 'Error on simple accessor with type string after change');

resolve(instance);
```

### Results

```json
{
    "uuid": "8a5471ff-cb25-4584-a4bb-10c9c179cd05",
    "mixed": -1,
    "boolean": true,
    "number": 42,
    "string": "Dolor sit amet",
    "date": "2000-01-01T02:00:00.000Z"
}
```