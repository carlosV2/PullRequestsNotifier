(function (Service, Adapter, Util) {
    // Set the object namespace
    Service.AddGithubAccount = {};

    /**
     * Function to verify if the suplied token is valid
     * @param string token Token to be validated
     * @return boolean Wheather the token is valid or not
     */
    function verifyToken(token)
    {
        return !!token;
    }

    /**
     * Function to save an auth token
     * @param  string       token Auth token
     * @return Util.Promise       Promise object
     */
    Service.AddGithubAccount.save = function (token)
    {
        if (!verifyToken(token)) {
            return Util.Promise.buildRejected('service.addGithubAccount.invalidAuthToken');
        }

        return Adapter.Accounts.findByToken(token)
            .done(function (account) {
                account.setToken(token);

                return Persister.Accounts.find(account.getId())
                    .done(function (existing) {
                        if (existing) {
                            return Util.Promise.buildRejected('service.addGithubAccount.accountAlreadyRegistered');
                        } else {
                            return Persister.Accounts.save(account);
                        }
                    })
            })
        ;
    }
})(window.Service = window.Service || {}, window.Adapter, window.Util);
