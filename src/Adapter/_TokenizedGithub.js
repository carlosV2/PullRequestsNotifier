(function (Adapter, Service, Util) {
    // Set the object namespace
    Adapter.TokenizedGithub = {};

    /**
     * Function to extend the Adapter.Github capabilities
     */
    function extendGithub()
    {
        for (var i in Adapter.Github) {
            /**
             * Function to make a tokenized AJAX call to Github
             * @param string url URL to call
             * @return Util.Promise Promise object
             */
            Adapter.TokenizedGithub[i] = function (url)
            {
                var token = Service.TokenContext.get();

                if (!token) {
                    return Util.Promise.buildRejected('adapter.tokenizedGithub.tokenNotSet');
                }

                return Adapter.Github[i](url, token);
            };
        }
    }

    // Extend Adapter.Github
    extendGithub();
})(window.Adapter = window.Adapter || {}, window.Service, window.Util);
