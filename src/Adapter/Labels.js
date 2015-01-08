(function (Adapter) {
    // Set the object namespace
    Adapter.Labels = {};

    /**
     * URL for labels loading
     * @type string
     */
    var url = '/repos/:owner/:repo/labels';

    /**
     * Function to find the repositories in github
     * @param  Entity.Repository repository Repository to get the labels for
     * @param  Entity.Account    account    Account to get the labels for
     * @return Util.Promise                 Promise object
     */
    Adapter.Labels.findByRepositoryAndAccount = function (repository, account)
    {
        var owner = account.getName();

        if (repository.getOrganization()) {
            owner = repository.getOrganization().getName();
        }

        var callingUrl = url
            .replace(':owner', owner)
            .replace(':repo', repository.getName())
        ;

        return Adapter.Github.get(callingUrl, account.getToken())
            .done(function (labels) {
                return labels.map(function (label) {
                    var entity = new Entity.Label(label.name);
                    entity.setBgColor(label.color);

                    return entity;
                })
            })
        ;
    };
})(window.Adapter = window.Adapter || {});
