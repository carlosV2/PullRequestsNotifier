(function (Service, Adapter, Util) {
    // Set the object namespace
    Service.StoreAuthToken = {};

    /**
     * URL to test against
     * @type string
     */
    var url = '/user';

    /**
     * Function to verify if the suplied token is valid
     * @param string token Token to be validated
     * @return Util.Promise Promise object
     */
    function verifyToken(token)
    {
        if (!token) {
            return Util.Promise.buildRejected('service.storeAuthToken.emptyAuthToken');
        }

        return Adapter.Github.get(url, token);
    }

    /**
     * Function to save the suplied token
     * @param string token Token to be saved
     * @return Util.Promise Promise object
     */
    function saveToken(token)
    {
        return Persister.Configuration.setAuthToken(token);
    }

    /**
     * Function to save an auth token
     * @param  string       token Auth token
     * @return Util.Promise       Promise object
     */
    Service.StoreAuthToken.save = function (token)
    {
        return verifyToken(token)
            .rename('Service.StoreAuthToken.save(' + token + ')')
            .done(function () {
                return saveToken(token);
            })
        ;
    }
})(window.Service = window.Service || {}, window.Adapter, window.Util);
