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
`array`
`object`
`string`
`date`
`regexp`
`function`
`boolean`
`number`
`null`
`undefined`
```


##Example usage

```javascript
 audit.getType([1, 2]);             // 'array'

 audit.isString('foo');             // 'foo' (it passes the test)
 audit.isNumber('foo');             // Throws an error
 audit.mapType('nunber', [1, 2, 3]) // passes, no error
```

