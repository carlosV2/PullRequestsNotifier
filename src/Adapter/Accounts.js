(function (Adapter, Util) {
    // Set the object namespace
    Adapter.Accounts = {};

    /**
     * URL for retrieve the user Account
     * @type string
     */
    var url = '/user';

    /**
     * Function to return the user details
     * @return Util.Promise Promise object
     */
    Adapter.Accounts.findByToken = function (token)
    {
        return Adapter.Github.get(url, token)
            .done(function (account) {
                return new Entity.Account(
                    account.id,
                    account.login,
                    'github'
                );
            })
        ;
    };
})(window.Adapter = window.Adapter || {}, window.Util);
