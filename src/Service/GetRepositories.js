(function (Service, Persister, Adapter, Entity, Util) {
    // Set the object namespace
    Service.GetRepositories = {};

    /**
     * Function to remove the tracked repositories from the remote list
     * @param  Entity.Repository[] remoteRepositories   Repositories from Github
     * @param  Entity.Repository[] trackingRepositories Repositories from storage
     * @return array                                    Array containing the generated lists
     */
    function removeDuplicates(userRepositories, orgsRepositories, trackingRepositories) {
        var remoteRepositoriesList = [];

        userRepositories.concat(orgsRepositories).forEach(function (repository) {
            for (var i in trackingRepositories) {
                if (trackingRepositories[i].equals(repository)) {
                    return;
                }
            }

            remoteRepositoriesList.push(repository);
        });

        return Util.Promise.pack(remoteRepositoriesList, trackingRepositories);
    }

    /**
     * Function to get a list of repositories
     * @param  Entity.Account account Account to get repositories for
     * @return Util.Promise           Promise object
     */
    Service.GetRepositories.findByAccount = function (account)
    {
        return [
            Adapter.Repositories.findByAccount(account),
            Service.GetOrganizationsRepositories.findByAccount(account)
        ].getCombinedPromise()
            .done(function (userRepositories, orgsRepositories) {
                return removeDuplicates(userRepositories, orgsRepositories, account.getRepositories());
            })
        ;
    };
})(window.Service = window.Service || {}, window.Persister, window.Adapter, window.Entity, window.Util);
