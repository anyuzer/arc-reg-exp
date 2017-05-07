# arc-reg-exp [![Build Status](https://travis-ci.org/anyuzer/arc-reg-exp.svg?branch=master)](https://travis-ci.org/anyuzer/arc-reg-exp)
A RegExp convenience subclass for javascript (ES6)

## Install
```
$ npm install arc-reg-exp --save
```

## Features
* matchAll()
* matchAndReplace()
* replaceCallback()

## Basic Usage
In native RegExp when using the g modifier, you cannot easily do subgroup captures.

In this way the following pattern `/h([^o]{3}o)/g` when matched against a string `hello world, hallo world, happo world` would return `[hello, hallo, happo]` but not `[[hello,ell],[hallo,all],[happo,app]]`

This convenience class allows that behavior, as well as builds on it to do replacement behavior, and callback behavior while capturing all data. This can be convenient for simple tokenization, or a few other cases.

**NOTE: These methods have been tested against reasonable, small string evaluation cases and may not be suitable for larger tasks.**

```js
const ArcRegExp = require('arc-reg-exp');

//We use the same constructor signatures as RegExp
let ARX = new ArcRegExp(/\/:([^\/]*)/);
const params = {
    key:'cats',
    val:'2'
};

//In the case of replaceCallback we will be called with a full match array on every isolated match
const [path,matches] = ARX.replaceCallback('/pets/:key/:val',([match,group])=>{
    return `/${params[group]}`;
});

console.log(path); //Should return /pets/cats/2
console.log(matches); //Should be [['/:key','key'],['/:val','val']]
```

## API

### new ArcRegExp([See RegExp Signature])
Create a new `ArcRegExp` object. Requires `new`

### .matchAll(searchString:String)
Search for matches in a string, and return an array of match arrays back

### .matchAndReplace(searchString:String [, replaceString:String, limit:Number])
Accept a search string, as well as 2 optional args, replaceString which will default to `''` in the event none is passed in and limit which will not apply if not passed in.

Search for matches, replace with the replaceString for as many times until limit is met, or until no more matches are found in the case of no limit being set.

Returns an array of `[newString,matches]`

### .replaceCallback(searchString:String,callback:Function)

Accept a search string, as well as a callback function. On every match, call the callback passing in the full match array and replacing the found value with the return value of the callback.

Returns an array of `[newString,matches]`

## Testing
```
npm test
```
