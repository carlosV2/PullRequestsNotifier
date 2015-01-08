(function (Service, Persister, Adapter, Entity, Util) {
    // Set the object namespace
    Service.GetConfigurations = {};

    /**
     * Function to get the configurations
     * @return Util.Promise Promise object
     */
    Service.GetConfigurations.getConfigs = function ()
    {
        return [
            Persister.Configuration.getOrganizationRepositories()
        ]
            .getCombinedPromise('Service.GetConfigurations.getConfigs()')
        ;
    };
})(window.Service = window.Service || {}, window.Persister, window.Adapter, window.Entity, window.Util);
