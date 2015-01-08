(function (Entity) {
    /**
     * Account class
     * @param string id   Account's external ID
     * @param string name Account's name
     * @param string type Account's type
     */
    Entity.Account = function (id, name, type)
    {
        /**
         * The object instance
         * @type Entity.Account
         */
        var me = this;

        /**
         * ID
         * @type string
         */
        me._id = id;

        /**
         * Name
         * @type string
         */
        me._name = name;

        /**
         * Type
         * @type string
         */
        me._type = type;

        /**
         * Token
         * @type string
         */
        me._token = null;

        /**
         * Repositories
         * @type Entity.Repository[]
         */
        me._repositories = [];

        /**
         * ID getter
         * @return string Entity's ID
         */
        me.getId = function ()
        {
            return me._id;
        };

        /**
         * Name getter
         * @return string Entity's name
         */
        me.getName = function ()
        {
            return me._name;
        };

        /**
         * Type getter
         * @return string Entity's type
         */
        me.getType = function ()
        {
            return me._type;
        };

        /**
         * Token setter
         * @param string token Token's account
         */
        me.setToken = function (token)
        {
            me._token = token;
        };

        /**
         * Token getter
         * @return string Token's account
         */
        me.getToken = function ()
        {
            return me._token;
        };

        /**
         * Function to compare two compare two repositories
         * @param  Entity.Account account Account to compare with
         * @return bool                   Result of comparision
         */
        me.equals = function (account)
        {
            return (me._id === account.getId() && me._type === account.getType());
        };

        /**
         * Attach repository
         * @param Entity.Repository repository Repository belonging to this account
         */
        me.attachRepository = function (repository)
        {
            me._repositories.push(repository);
        };

        /**
         * Repositories getter
         * @return Entity.Repository[] Repositories attached to this account
         */
        me.getRepositories = function ()
        {
            return me._repositories;
        };

        /**
         * Remove repository from the account
         * @param Entity.Repository repository Repository to be removed
         */
        me.removeRepository = function(repository)
        {
            var repositories = [];
            for (var i in me._repositories) {
                if (!repository.equals(me._repositories[i])) {
                    repositories.push(me._repositories[i]);
                }
            }

            me._repositories = repositories;
        };
    };
})(window.Entity = window.Entity || {});
