(function (Adapter, Persister, Util) {
    // Set the object namespace
    Adapter.Organizations = {};

    /**
     * URL for retrieve the organizations
     * @type string
     */
    var url = '/user/orgs';

    /**
     * Function to return the user as Organization
     * @param  Entity.Account account Account with the token
     * @return Util.Promise           Promise object
     */
    Adapter.Organizations.findByAccount = function (account)
    {
        return Adapter.Github.get(url, account.getToken())
            .done(function (organizations) {
                return organizations.map(function (organization) {
                    return new Entity.Organization(
                        organization.id,
                        organization.login
                    );
                });
            })
        ;
    };
})(window.Adapter = window.Adapter || {}, window.Persister, window.Util);
