(function (Persister, Util) {
    // Set the object namespace
    Persister.Organizations = {};

    /**
     * Function to get a single element under an index
     * @param  string       index Element to find
     * @return Util.Promise       Promise object
     */
    Persister.Organizations.find = function (index)
    {
        return Persister.Mapper.find(Entity.Organization, index)
            .rename('Persister.Organizations.find(' + index + ')')
        ;
    };

    /**
     * Function to add values under a key
     * @param  object       organization Organization object to be stored
     * @return Util.Promise              Promise object
     */
    Persister.Organizations.add = function (organization)
    {
        return Persister.Mapper.add(organization)
            .rename('Persister.Organizations.add(' + JSON.stringify(organization) + ')');
        ;
    };

    /**
     * Function to remove a value under a key
     * @param  object       organization Organization object to be stored
     * @return Util.Promise              Promise object
     */
    Persister.Organizations.remove = function (organization)
    {
        return Persister.Mapper.remove(organization)
            .rename('Persister.Organizations.remove(' + JSON.stringify(organization) + ')')
        ;
    };
})(window.Persister = window.Persister || {}, window.Util);
