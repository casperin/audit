# audit

This tool is used for contractual javascript (probably there is a
fancier name), where parameters passed into functions are checked before
any work is done.

The tool also exposes a method for getting the type of pretty much
anything you throw at it.

`audit` will throw an error if a type check fails, otherwise it will
return the value that is being checked (to allow users to save space).

`audit` is absolutely not meant to be deplayed to production, rather
just serve as a helping tool during development of more complicated
javascript.

Types are (casing is irrelevant):

```javascript
'array'
'object'
'string'
'date'
'regexp'
'function'
'boolean'
'number'
'null'
'undefined'
```


##Example usage

```javascript
audit.getType([1, 2]);                  // 'array'


audit.isString('foo');                  // 'foo' (it passes the test)
audit.isNumber('foo');                  // Throws an error
audit.mapType('number', [1, 2, 3])      // passes, no error


[3, 4, 5].map(audit.condition('< 5'));  // Throws error (5 is not less than 5)


// Checking the "interface" of an object
var myObject = {
        a: 1,
        b: 'str',
        c: function (x, y) { return x + y; }
    },

    myInterface = {
        a: 'number',
        b: 'string:3',
        c: 'function:3'
    };

interface(myInterface, myObject);
    // Throws: function (x, y) { return x + y; } does not have the length 3. It's 2.
```

