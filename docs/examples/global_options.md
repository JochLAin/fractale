### Models

```javascript
const Global_Options = Fractale.create("Global_Options", {
    transformed: Number
});
```

### Run

```javascript
const { Global_Options } = module.exports.get();

const instance = new Global_Options({
    transformed: 39,
});

_.test(instance.transformed, 39, 'Error on global option transform accessor with type percentage');

instance.transformed = '10%';

_.test(instance.transformed, 0.1, 'Error on global option transform accessor with type percentage');

resolve(instance);
```

### Results

```json
{
    "uuid": "e25c2298-3c09-4529-9384-aa799614be51",
    "transformed": 0.1
}
```