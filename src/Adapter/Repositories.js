(function (Adapter, Util) {
    // Set the object namespace
    Adapter.Repositories = {};

    /**
     * URL to get user repositories
     * @type string
     */
    var userReposUrl = '/users/:username/repos';

    /**
     * URL to get repositories per organization
     * @type string
     */
    var orgReposUrl = '/orgs/:org/repos';

    /**
     * Function to find the repositories by user
     * @param  Entity.Account account Account to get repos from
     * @return Util.Promise           Promise object
     */
    Adapter.Repositories.findByAccount = function (account)
    {
        var url = userReposUrl.replace(':username', account.getName());

        return Adapter.Github.get(url, account.getToken())
            .done(function (repositories) {
                return repositories.map(function (repository) {
                    var entity = new Entity.Repository(
                        repository.id,
                        repository.name
                    );

                    entity.setAccount(account);

                    return entity;
                 });
            })
        ;
    }

    /**
     * Function to find the repositories in github
     * @param  Entity.Organization organization Organization to get repositories from
     * @param  Entity.Account      account      Account to get repositories from
     * @return Util.Promise                     Promise object
     */
    Adapter.Repositories.findByOrganizationAndAccount = function (organization, account)
    {
        var url = orgReposUrl.replace(':org', organization.getName());

        return Adapter.Github.get(url, account.getToken())
            .done(function (repositories) {
                return repositories.map(function (repository) {
                    var entity = new Entity.Repository(
                        repository.id,
                        repository.name
                    );

                    entity.setAccount(account);
                    entity.setOrganization(organization);

                    return entity;
                });
            })
        ;
    };
})(window.Adapter = window.Adapter || {}, window.Util);
