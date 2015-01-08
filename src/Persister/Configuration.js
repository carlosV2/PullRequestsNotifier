(function (Persister) {
    // Set the object namespace
    Persister.Configuration = {};

    /**
     * Configuration cache
     * @type object
     */
    var cache = {};

    /**
     * Key to store and get data from
     * @type string
     */
    var key = 'configuration';

    /**
     * Function to define a getter, setter and isset functions for a given configuration
     * @param string configurationKey Key to be defined
     * @param mixed  defaultValue     Default value if it is not set
     */
    function defineConfigurationKey(configurationKey, defaultValue)
    {
        var fnKey = configurationKey.charAt(0).toUpperCase() + configurationKey.slice(1);

        // Defined the getter
        Persister.Configuration['get' + fnKey] = function ()
        {
            if (configurationKey in cache) {
                return Util.Promise.buildResolved(
                    'Persister.Configuration.get' + fnKey + '() - Cache hit',
                    cache[configurationKey]
                );
            } else {
                return Persister.Repository.find(key, configurationKey)
                    .rename('Persister.Configuration.get' + fnKey + '()')
                    .done(function (value) {
                        if (value === null) {
                            value = defaultValue;
                        }
                        cache[configurationKey] = value;

                        return cache[configurationKey];
                    })
                ;
            }
        };

        // Define the setter
        Persister.Configuration['set' + fnKey] = function (value)
        {
            cache[configurationKey] = value;

            return Persister.Repository.add(key, configurationKey, value)
                .rename('Persister.Configuration.set' + fnKey + '(' + JSON.stringify(value) + ')')
            ;
        };

        // Define the isset
        Persister.Configuration['isset' + fnKey] = function ()
        {
            return Persister.Configuration['get' + fnKey]()
                .rename('Persister.Configuration.isset' + fnKey + '()')
                .done(function (value) {
                    return !!value;
                })
            ;
        };
    }

    // Define the configuration keys
    defineConfigurationKey('authToken', null);
    defineConfigurationKey('organizationRepositories', false);
})(window.Persister = window.Persister || {});
