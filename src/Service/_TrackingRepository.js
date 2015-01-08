(function (Service, Persister) {
    // Set the object namespace
    Service.TrackingRepository = {};

    /**
     * Function to start tracking a repoitory
     * @param  Entity.Repository repository Repository to be tracked
     * @return Util.Promise                 Promise object
     */
    Service.TrackingRepository.startTracking = function (repository)
    {
        return Persister.Repositories.save(repository);
    };

    /**
     * Function to start stop tracking a repoitory
     * @param  Entity.Repository repository Repository to be tracked
     * @return Util.Promise                 Promise object
     */
    Service.TrackingRepository.stopTracking = function (repository)
    {
        return Persister.Repositories.remove(repository);
    };
})(window.Service = window.Service || {}, window.Persister);
