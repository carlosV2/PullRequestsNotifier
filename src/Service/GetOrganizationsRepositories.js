(function (Service, Persister, Adapter, Entity, Util) {
    // Set the object namespace
    Service.GetOrganizationsRepositories = {};

    /**
     * Function to combine an undefined list of repositories into a single array
     * @return Entity.Repository[] List of repositories
     */
    function combineRepositories(/* args */)
    {
        var repositories = [];

        for (var i in arguments) {
            repositories = repositories.concat(arguments[i]);
        }

        return repositories;
    }

    /**
     * Function to load all the repositories from all the subscribed organizations
     * @param  Entity.Organization[] organizations List of organizations
     * @param  Entity.Account        account       Account to get the repositories
     * @return Util.Promise Promise object
     */
    function loadRepositories(organizations, account)
    {
        var promises = [];

        organizations.forEach(function (organization) {
            promises.push(Adapter.Repositories.findByOrganizationAndAccount(organization, account));
        });

        return promises.getCombinedPromise()
            .done(combineRepositories)
        ;
    }

    /**
     * Function to get a list of repositories
     * @param  Entity.Account account Account to get the repositories from
     * @return Util.Promise           Promise object
     */
    Service.GetOrganizationsRepositories.findByAccount = function (account)
    {
        return Adapter.Organizations.findByAccount(account)
            .done(function (organizations) {
                return loadRepositories(organizations, account);
            })
        ;
    };
})(window.Service = window.Service || {}, window.Persister, window.Adapter, window.Entity, window.Util);
