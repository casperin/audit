(function (root) {
    /**
     * Gorm Casper - some rainy autumn evening, 2014.
     *
     * This tool is used for contractual javascript (probably there is a
     * fancier name), where parameters passed into functions are checked before
     * any work is done.
     *
     * The tool also exposes a method for getting the type of pretty much
     * anything you throw at it.
     *
     * `audit` will throw an error if a type check fails, otherwise it will
     * return the value that is being checked (to allow users to save space).
     *
     * `audit` is absolutely not meant to be deplayed to production, rather
     * just serve as a helping tool during development of more complicated
     * javascript.
     *
     * Types are (casing is irrelevant):
     *     `array`
     *     `object`
     *     `string`
     *     `date`
     *     `regexp`
     *     `function`
     *     `boolean`
     *     `number`
     *     `null`
     *     `undefined`
     */



    /**
     * Example usage
     *
     *      audit.getType([1, 2]);  => 'array'
     *
     *      audit.isString('foo');  => 'foo' (it passes the test)
     *      audit.isNumber('foo');  => Throws an error
     *      audit.mapType('nunber', [1, 2, 3]) => passes, no error
     *
     */



    /**
     * Heart of the system. This will take any element and return its type.
     * See: toddmotto.com/deprecating-the-switch-statement-for-object-literals
     *
     * x -> x
     */
    function getType (x) {
        return Object.prototype.toString.call(x).slice(8, -1).toLowerCase();
    }

    /**
     * Takes a signature (such as `string`, `function`, or `orray:3` and
     * an element and throws an error if the element does not match the type
     * signature passed in; otherwise it just returns the element passed in.
     *
     * String -> x -> x|Error
     */
    function is (signature, x) {
        function main (x_) {
            var sig = signature.toLowerCase().split(':'),
                type = sig[0],
                len = +sig[1];

            if (getType(x_) !== type) {
                throw x_ + ' is not a ' + type + '. It\'s a ' + getType(x_);
            }

            if (len && (x_.length !== len)) {
                throw x_ + ' does not have the length ' + len + '. It\'s ' + x_.length;
            }

            return x_;
        }

        if (arguments.length === 1) return main;
        if (arguments.length >= 2) return main(x);
        return is;
    }

    /**
     * Util function usually used for checking wether parameters passed into a
     * function are there
     *
     * x -> x
     */
    function notNullOrUndefined (x) {
        if (!x) {
            throw 'Expected a value, but got ' + x;
        }

        return x;
    }

    /**
     * Takes an array (or anything with a method `.map(fn)` defined on it) and
     * checks each item whether it matches the array.
     *
     * String -> [a] -> [a]|Error
     */
    function mapType (type, x) {
        function main (x_) {
            x_.map(is(type));

            return x_;
        }

        if (arguments.length === 1) return main;
        if (arguments.length >= 2) return main(x);
        return mapType;
    }

    /**
     * Takes a `condition` and checks its next argument `x` up against it. The
     * function builds a new function based on its first parameter, and so
     * can't be optimized by compilers (in other words: it's a slow function to
     * run - don't over use).
     *
     * Examples:
     *      condition('> 4', 5)
     *          Passes the test (5 is bigger than 4) so it just returns 5.
     *
     *      condition('.length === 4', [1, 2, 3])
     *          Throws: 1,2,3 did not meet the condition .length === 4.
     *
     *      [3.4, 2.6, 2.9, 14.3].map(audit.condition('.toFixed(0) == 3'))
     *          Throws: 14.3 did not meet the condition .toFixed(0) == 3.
     *
     * String -> x -> x|Error
     */
    function condition (condition, x) {
        var check = new Function('x', 'return x ' + condition);

        function checker (x) {
            if (!check(x)) {
                throw x + ' did not meet the condition ' + condition;
            }

            return x;
        }

        if (arguments.length === 1) return checker;
        if (arguments.length >= 2) return checker(x);
        return condition;
    }

    /**
     * This takes an "interface" that describes the second parameter, the
     * object (usually a class-like object). If any of the properties in the
     * object fails the test, `interface` will throw an error.
     *
     * Example:
     *
     *      var myObject = {
     *              a: 1,
     *              b: 'str',
     *              c: function (x, y) { return x + y; }
     *          },
     *
     *          myInterface = {
     *              a: 'number',
     *              b: 'string:3',
     *              c: 'function:3'
     *          };
     *
     *      interface(myInterface, myObject);
     *          Throws: function (x, y) { return x + y; } does not have the length 3. It's 2.
     *
     *
     * {String} -> (a) -> (a)|Error
     */
    function interface (interface, object) {
        function main (obj) {
            Object.keys(interface).forEach(function (key) {
                is(interface[key], obj[key]);
            });

            return obj;
        }

        if (arguments.length === 1) return main;
        if (arguments.length >= 2) return main(object);
        return interface;
    }

    /**
     * All the public functions. Most of these are partially applied versions
     * of `is`.
     */
    root.audit = {

        // Not used for checking anything, but still quite useful.
        getType: getType,

        // Main function
        isType: is,

        // Map version of the above
        mapType: mapType,

        // Convenience functions
        isNumber: is('number'),
        isString: is('string'),
        isArray: is('array'),
        isObject: is('object'),
        isDate: is('date'),
        isFunction: is('function'),
        isRegExp: is('regexp'),
        isBoolean: is('boolean'),
        isNull: is('null'),
        isUndefined: is('undefined'),

        // Special case functions
        notNullOrUndefined: notNullOrUndefined,
        condition: condition,
        interface: interface
    };

})(window);
