(function (Entity) {
    /**
     * Organization class
     * @param string id   Organization's external ID
     * @param string name Organization's name
     */
    Entity.Organization = function (id, name)
    {
        /**
         * The object instance
         * @type Entity.Organization
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
         * Function to compare two compare two repositories
         * @param  Entity.Organization organization Organization to compare with
         * @return bool                             Result of comparision
         */
        me.equals = function (organization)
        {
            return (me._id === Organization.getId());
        };
    };
})(window.Entity = window.Entity || {});
