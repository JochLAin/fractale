<a name="module_Fractale"></a>

## Fractale
Module endpoint

**Author**: Jocelyn Faihy <jocelyn@faihy.fr>  

* [Fractale](#module_Fractale)
    * [.Color](#module_Fractale.Color)
    * [.SELF](#module_Fractale.SELF)
    * [.factory](#module_Fractale.factory)
    * [.helpers](#module_Fractale.helpers)
    * [.library](#module_Fractale.library)
    * [.memory](#module_Fractale.memory)
    * [.create()](#module_Fractale.create)
    * [.get()](#module_Fractale.get)
    * [.setOption()](#module_Fractale.setOption)
    * [.getOption()](#module_Fractale.getOption)
    * [.setModel()](#module_Fractale.setModel)
    * [.getModel()](#module_Fractale.getModel)
    * [.from()](#module_Fractale.from)
    * [.validate()](#module_Fractale.validate)
    * [.with(type, options)](#module_Fractale.with)
    * [.stringify()](#module_Fractale.stringify)

<a name="module_Fractale.Color"></a>

### Fractale.Color
Fractale color shortcut

**Kind**: static property of [<code>Fractale</code>](#module_Fractale)  

| Param | Type |
| --- | --- |
| Color | <code>Color</code> | 

<a name="module_Fractale.SELF"></a>

### Fractale.SELF
Keyword used for self-referenced model

**Kind**: static property of [<code>Fractale</code>](#module_Fractale)  

| Param | Type |
| --- | --- |
| SELF | <code>string</code> | 

<a name="module_Fractale.factory"></a>

### Fractale.factory
Factory that create models

**Kind**: static property of [<code>Fractale</code>](#module_Fractale)  

| Param | Type |
| --- | --- |
| factory | [<code>Factory</code>](#Factory) | 

<a name="module_Fractale.helpers"></a>

### Fractale.helpers
Fractale helpers

**Kind**: static property of [<code>Fractale</code>](#module_Fractale)  
**See**: helpers  

| Param | Type |
| --- | --- |
| helpers | <code>Object</code> | 

<a name="module_Fractale.library"></a>

### Fractale.library
Library that register models

**Kind**: static property of [<code>Fractale</code>](#module_Fractale)  

| Param | Type |
| --- | --- |
| library | <code>Library</code> | 

<a name="module_Fractale.memory"></a>

### Fractale.memory
Memory that register model instances

**Kind**: static property of [<code>Fractale</code>](#module_Fractale)  

| Param | Type |
| --- | --- |
| memory | <code>Memory</code> | 

<a name="module_Fractale.create"></a>

### Fractale.create()
Proxy to Factory createModel method

**Kind**: static method of [<code>Fractale</code>](#module_Fractale)  
**See**: Factory  
<a name="module_Fractale.get"></a>

### Fractale.get()
Proxy to Library get method

**Kind**: static method of [<code>Fractale</code>](#module_Fractale)  
**See**: Library  
<a name="module_Fractale.setOption"></a>

### Fractale.setOption()
Proxy to Option set method

**Kind**: static method of [<code>Fractale</code>](#module_Fractale)  
**See**: Option  
<a name="module_Fractale.getOption"></a>

### Fractale.getOption()
Proxy to Option get method

**Kind**: static method of [<code>Fractale</code>](#module_Fractale)  
**See**: Option  
<a name="module_Fractale.setModel"></a>

### Fractale.setModel()
Set the Model base class

**Kind**: static method of [<code>Fractale</code>](#module_Fractale)  
<a name="module_Fractale.getModel"></a>

### Fractale.getModel()
Set the Model base class

**Kind**: static method of [<code>Fractale</code>](#module_Fractale)  
**See**: Model  
<a name="module_Fractale.from"></a>

### Fractale.from()
Proxy to async model type

**Kind**: static method of [<code>Fractale</code>](#module_Fractale)  
<a name="module_Fractale.validate"></a>

### Fractale.validate()
Proxy to Factory validate method

**Kind**: static method of [<code>Fractale</code>](#module_Fractale)  
**See**: Factory  
<a name="module_Fractale.with"></a>

### Fractale.with(type, options)
Helper to create type with options

**Kind**: static method of [<code>Fractale</code>](#module_Fractale)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>undefined</code> \| <code>Boolean</code> \| <code>Number</code> \| <code>String</code> \| <code>Date</code> \| [<code>Model</code>](#Model) \| <code>Array</code> \| <code>Object</code> | Property type |
| options | <code>Object</code> | Options pass to type |

<a name="module_Fractale.stringify"></a>

### Fractale.stringify()
Stringify a model

**Kind**: static method of [<code>Fractale</code>](#module_Fractale)  
