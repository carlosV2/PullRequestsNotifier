(function (Util) {
    // Set the object namespace
    Util.Promise = function ()
    {
        /**
         * Instance of this object
         * @type Promise
         */
        var me = this;

        /**
         * Function to call when the promise is resolved
         * @type function
         */
        var _resolvedFunctions = [];

        /**
         * Conditional function to call when failure
         * @type function[]
         */
        var _failedFunctions = {};

        /**
         * Function to call if there is no satified condition
         * @type function
         */
        var _defaultFailedFunction = null;

        /**
         * Function to set the resolved function
         * @param function resolvedFunction Function to be executed when resolved
         * @return Promise Same object instance
         */
        me.done = function (resolvedFunction)
        {
            if (typeof resolvedFunction === 'function') {
                _resolvedFunctions.push(resolvedFunction);
            }

            return me;
        };

        /**
         * Function to set failure callbacks
         * @param string|null condition      Condition that must be satisfied to execute id
         * @param function    failedFunction Function to be executed when failed
         * @return Promise Same object instance
         */
        me.fail = function (condition, failedFunction)
        {
            if (typeof failedFunction === 'function') {
                if (condition) {
                    _failedFunctions[condition] = failedFunction;
                } else {
                    _defaultFailedFunction = failedFunction;
                }
            }

            return me;
        };

        function executeResolvedFunctions(scope, args)
        {
            var i = 0;

            function executeFunction(index, data)
            {
                if (index < _resolvedFunctions.length) {
                    data = _resolvedFunctions[index].apply(scope, data);

                    if (data instanceof Util.Promise) {
                        data
                            .done(function (/* args */) {
                                data = Array.prototype.slice.call(arguments);
                                executeFunction(index + 1, data);
                            })
                            .fail(null, me.reject);
                        ;
                    } else if (data instanceof Object && data._promise_packed) {
                        executeFunction(index + 1, data.data);
                    } else {
                        executeFunction(index + 1, [data]);
                    }
                }
            }

            executeFunction(i, args);
        }

        /**
         * Call the resolved function
         */
        me.resolve = function (/* args */)
        {
            var args = Array.prototype.slice.call(arguments);
            var scope = this;

            if (_resolvedFunctions.length > 0) {
                executeResolvedFunctions(scope, args);
            } else {
                throw 'Promise: RESOLVE function called without any listener. Arguments: ' + JSON.stringify(args);
            }
        };

        /**
         * Call the failure function
         * @param string reason Reason or condition of failure
         */
        me.reject = function (reason/*, args */)
        {
            var args = Array.prototype.slice.call(arguments);
            var scope = this;

            if (_failedFunctions[reason]) {
                _failedFunctions[reason].apply(scope, args);
            } else if (_defaultFailedFunction) {
                _defaultFailedFunction.apply(scope, args);
            } else {
                throw 'Promise: REJECT function called without any listener. Arguments: ' + JSON.stringify(args);
            }
        };
    };

    // Include a propery into Array object as non enumerable
    Object.defineProperty(Array.prototype, 'getCombinedPromise', {
        /**
         * Function to get a combined promise from an array
         * @return Util.Promise      Combined promise object
         */
        value: function () {
            var values = [];
            var total = this.length;
            var done = 0;
            var rejected = false;
            var combinedPromise = new Util.Promise();

            if (total === 0) {
                return Util.Promise.buildResolved();
            }

            for (var i in this) {
                var promise = this[i];
                values.push(null);

                if (promise instanceof Util.Promise) {
                    (function (promise, i) {
                        promise
                            .done(function () {
                                var args = Array.prototype.slice.call(arguments);
                                values[i] = (args.length === 1 ? args[0] : args);
                                done++;

                                if (done >= total) {
                                    combinedPromise.resolve.apply(combinedPromise, values);
                                }
                            })
                            .fail(null, function (reason) {
                                if (!rejected) {
                                    rejected = true;
                                    combinedPromise.reject(reason);
                                }
                            })
                        ;
                    })(promise, i);
                } else {
                    return Util.Promise.buildRejected('util.promise.notAPromise', promise);
                }
            }

            return combinedPromise;
        },
        enumerable: false
    });

    /**
     * Function to build an already resolved promise without breaking the code
     * @param  string       name Name for the promise
     * @return Util.Promise      Promise object
     */
    Util.Promise.buildResolved = function (/* args */)
    {
        var args = Array.prototype.slice.call(arguments);
        var scope = this;
        var promise = new Util.Promise();

        setTimeout(promise.resolve.bind.apply(promise.resolve, [this].concat(args)), 1);
        /*setTimeout(function () {
            promise.resolve.apply(this, args);
        }, 1);*/

        return promise;
    };

    /**
     * Function to build an already rejected promise without breaking the code
     * @param  string       reason Rejection reason
     * @return Util.Promise        Promise object
     */
    Util.Promise.buildRejected = function (reason/*, args */)
    {
        var promise = new Util.Promise();
        var args = Array.prototype.slice.call(arguments);

        setTimeout(promise.reject.bind.apply(promise.reject, [this].concat(args)), 1);

        return promise;
    };

    /**
     * Function to build an object for returning multiple values
     * @return object Object to return multiple values
     */
    Util.Promise.pack = function (/* args */)
    {
        var args = Array.prototype.slice.call(arguments);

        return {_promise_packed: true, data: args};
    };
})(window.Util = window.Util || {});
