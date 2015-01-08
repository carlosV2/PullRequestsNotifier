(function (Entity) {
    /**
     * Repository class
     * @param string id   Repository's external ID
     * @param string name Repository's name
     */
    Entity.Repository = function (id, name)
    {
        /**
         * The object instance
         * @type Repository
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
         * Owner organization
         * @type Entity.Organization
         */
        me._organization = null;

        /**
         * Discriminator field value
         * @type string
         */
        me._discriminator = Entity.Repository.DISCRIMINATOR_ALL_OF;

        /**
         * Labels attached to mark a PR as ready to review
         * @type Entity.Label[]
         */
        me._labels = [];

        /**
         * Account holding this entity
         * @type Entity.Account
         */
        me._account = null;

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
         * @param  Repository repository Repository to compare with
         * @return bool Result of comparision
         */
        me.equals = function (repository)
        {
            return (me._id === repository.getId());
        }

        /**
         * Function to set the organization owner
         * @param Entity.Organization organization Organization owner
         */
        me.setOrganization = function (organization)
        {
            me._organization = organization;
        };

        /**
         * Function to get the organization
         * @return Entity.Organization Organization owner
         */
        me.getOrganization = function ()
        {
            return me._organization;
        };

        /**
         * Discriminator setter
         * @param string value Value for the discriminator
         */
        me.setDiscriminator = function (value)
        {
            if (value === Entity.Repository.DISCRIMINATOR_ALL_OF ||
                value === Entity.Repository.DISCRIMINATOR_AT_LEAST_ONE_OF ||
                value === Entity.Repository.DISCRIMINATOR_NONE_OF
            ) {
                me._discriminator = value;
            }
        };

        /**
         * Discriminator getter
         * @return string Value for the discriminator
         */
        me.getDiscriminator = function ()
        {
            return me._discriminator;
        };

        /**
         * Labels setter
         * @param Entity.Label[] labels Labels to mark the PR as ready to review
         */
        me.setLabels = function (labels)
        {
            me._labels = labels;
        };

        /**
         * Labels getter
         * @param Entity.Label[] Labels to mark the PR as ready to review
         */
        me.getLabels = function ()
        {
            return me._labels;
        };

        /**
         * Account setter
         * @param Entity.Account account Account
         */
        me.setAccount = function (account)
        {
            me._account = account;
        };

        /**
         * Account getter
         * @return Entity.Account account
         */
        me.getAccount = function ()
        {
            return me._account;
        };
    };

    /**
     * Constant to mark the PR as reviewable when all of the labels are attached
     * @type string
     */
    Entity.Repository.DISCRIMINATOR_ALL_OF = 'all';

    /**
     * Constant to mark the PR as reviewable when at least of the labels are attached
     * @type string
     */
    Entity.Repository.DISCRIMINATOR_AT_LEAST_ONE_OF = 'one';

    /**
     * Constant to mark the PR as reviewable when none of the labels are attached
     * @type string
     */
    Entity.Repository.DISCRIMINATOR_NONE_OF = 'none';
})(window.Entity = window.Entity || {});
