(function (Service, Adapter, Entity, Util) {
    // Set the object namespace
    Service.GetLabels = {};

    /**
     * Function to get a list of label
     * @param  Entity.Repository repository Repository to get the labels for
     * @param  Entity.Account    account    Account for getting this labels
     * @return Util.Promise Promise object
     */
    Service.GetLabels.findByRepositoryAndAccount = function (repository, account)
    {
        return Adapter.Labels.findByRepositoryAndAccount(repository, )
            .done(function (githubLabels) {
                return [getEntityLabelsFromGithubLabels(githubLabels)];
            })
        ;
    };
})(window.Service = window.Service || {}, window.Adapter, window.Entity, window.Util);
