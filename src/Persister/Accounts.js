(function (Persister) {
    // Set the object namespace
    Persister.Accounts = {};

    /**
     * Function to load all the Accounts
     * @return Util.Promise Promise object
     */
    Persister.Accounts.findAll = function ()
    {
        return Persister.Mapper.findAll(Entity.Account);
    };

    /**
     * Function to load accounts by
     * @param  string       id Account's ID
     * @return Util.Promise    Promise object
     */
    Persister.Accounts.find = function (id)
    {
        return Persister.Mapper.find(Entity.Account, id);
    };

    /**
     * Function to save the Account entity
     * @param  Entity.Account Account Account object to save
     * @return Util.Promise                 Promise object
     */
    Persister.Accounts.save = function (account)
    {
        return Persister.Mapper.add(account);
    };
})(window.Persister = window.Persister || {});
