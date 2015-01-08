(function (Persister) {
    // Set the object namespace
    Persister.Repositories = {};

    /**
     * Function to load all the repositories
     * @return Util.Promise Promise object
     */
    Persister.Repositories.findAll = function ()
    {
        return Persister.Mapper.findAll(Entity.Repository);
    };

    /**
     * Function to save the repository entity
     * @param  Entity.Repository repository Repository object to save
     * @return Util.Promise                 Promise object
     */
    Persister.Repositories.save = function (repository)
    {
        return Persister.Mapper.add(repository);
    };

    /**
     * Function to remove a repository
     * @param  Entiy.Repository repository Repository to be removed
     * @return Util.Promise                Promise object
     */
    Persister.Repositories.remove = function (repository)
    {
        return Persister.Mapper.remove(repository);
    };
})(window.Persister = window.Persister || {});
