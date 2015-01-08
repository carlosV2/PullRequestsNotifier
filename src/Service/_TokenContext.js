(function (Service) {
    // Set the object namespace
    Service.TokenContext = {};

    /**
     * Token to use for connecting the API
     * @type string
     */
    var _token = null;

    /**
     * Function to keep the token in the context
     * @param string token Token to connect to the API
     */
    Service.TokenContext.set = function (token)
    {
        _token = token;
    };

    /**
     * Function to get the token from the context
     * @return string Token to connect to the API
     */
    Service.TokenContext.get = function ()
    {
        return _token;
    };
})(window.Service = window.Service || {});
