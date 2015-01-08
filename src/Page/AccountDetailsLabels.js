(function (Page) {
    /**
     * AccountDetailsLabels page
     * @param Entity.Repository repository Repository to manage the details of
     */
    Page.AccountDetailsLabels = function (repository)
    {
        /**
         * The object instance
         * @type Page.AccountDetails
         */
        var me = this;

        /**
         * Repository context
         * @type Entity.Repository
         */
        var _repository = repository;

        /**
         * Flag to let the page know it is being destroyed
         * @type boolean
         */
        var _destroyed = false;

        /**
         * Account details loading template
         * @type object
         */
        var _templateLoading = Templates.AccountDetails.Loading;

        /**
         * Account details repositories template
         * @type object
         */
        var _templateLabels = Templates.AccountDetails.Labels;

        /**
         * Function to initialize the labels account details
         * @param Entity.Label labels List of labels
         */
        function initializeLabels(labels)
        {
            Service.PageManager.switchView(_templateLabels);

            var name = _repository.getName();
            if (_repository.getOrganization()) {
                name = _repository.getOrganization().getName() + '/' + name;
            }
            $$('App.AccountDetails.Labels.Name').define('template', '<h2>' + name + '</h2>');
            $$('App.AccountDetails.Labels.Name').refresh();

            $$('App.AccountDetails.Labels.Back').attachEvent('onItemClick', function () {
                me.init(_templateLabels.id);
            });

            $$('App.AccountDetails.Labels.Discriminator.Radio').setValue(_repository.getDiscriminator());
            $$('App.AccountDetails.Labels.Discriminator.Radio').attachEvent('onChange', function () {
                _repository.setDiscriminator(this.getValue());
                Persister.Repositories.save(_repository);
            });

            var accountDetailsLabelsList = $$('App.AccountDetails.Labels.List');
            accountDetailsLabelsList.parse(labels);
            accountDetailsLabelsList.data.sort('_name', 'asc');
            accountDetailsLabelsList.attachEvent('onSelectChange', function () {
                var selected = this.getSelectedItem();

                if (!(selected instanceof Array)) {
                    selected = [selected];
                }

                _repository.setLabels(selected);
                Persister.Repositories.save(_repository);
            });

            var labels = _repository.getLabels();
            for (var i in labels) {
                var j = 0;
                while (j < accountDetailsLabelsList.count()) {
                    var id = accountDetailsLabelsList.getIdByIndex(j);
                    var label = accountDetailsLabelsList.getItem(id);

                    if (label.equals(labels[i])) {
                        accountDetailsLabelsList.select(id, true);
                        break;
                    }

                    j++;
                }
            }
        }

        /**
         * Function to initialize the account
         * @param string id Id to replace
         */
        me.init = function (id)
        {
            Service.PageManager.switchView(_templateLoading);

            Adapter.Labels.findByRepositoryAndAccount(_repository, _account)
                .done(function (labels) {
                    if (!_destroyed) {
                        initializeLabels(labels);
                    }
                })
            ;
        };

        /**
         * Function to set this page as being destroyed
         */
        me.destroy = function ()
        {
            _destroyed = true;
        };
    };
})(window.Page = window.Page || {});
