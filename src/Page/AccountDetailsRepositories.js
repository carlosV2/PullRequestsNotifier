(function (Page) {
    /**
     * AccountDetailsRepositories page
     * @param Entity.Account account Account to manage the details of
     */
    Page.AccountDetailsRepositories = function (account)
    {
        /**
         * The object instance
         * @type Page.AccountDetailsRepositories
         */
        var me = this;

        /**
         * Account context
         * @type Entity.Account
         */
        var _account = account;

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
        var _templateRepositories = Templates.AccountDetails.Repositories.Lists;

        /**
         * Function to configure the account
         * @param string     id Element's ID
         * @param MouseEvent e  Mouse event
         */
        function configureAccount(id, e)
        {
            if (e.target.className === 'config') {
                Service.PageManager.switchPage(new Page.AccountDetailsLabels(
                    $$('App.AccountDetails.Repositories.Lists.Tracking.List').getItem(id)
                ));
            }
        }

        /**
         * Function to start tracking a repository
         */
        function accountDetailsRepositoriesRepositoriesTrackButtonEvtClick()
        {
            var remoteRepositoriesList = $$('App.AccountDetails.Repositories.Lists.Remote.List');
            var repository = remoteRepositoriesList.getSelectedItem();

            _account.attachRepository(repository);
            Persister.Accounts.save(_account)
                .done(function() {
                    $$('App.AccountDetails.Repositories.Lists.Tracking.List').data.add(repository);
                    remoteRepositoriesList.data.remove(remoteRepositoriesList.getSelectedId());

                    updateStatusForTrackAndUntrackButtons();
                })
            ;
        }

        /**
         * Function to stop tracking a repository
         */
        function accountDetailsRepositoriesRepositoriesUntrackButtonEvtClick()
        {
            var trackingRepositoriesList = $$('App.AccountDetails.Repositories.Lists.Tracking.List');
            var repository = trackingRepositoriesList.getSelectedItem();

            webix.confirm('Untracking repositories clear all the information about them. Do you wish to continue?', function(result) {
                if (result) {
                    _account.removeRepository(repository);
                    Persister.Accounts.save(_account)
                        .done(function () {
                            return Persister.Repositories.remove(repository)
                                .done(function () {
                                    $$('App.AccountDetails.Repositories.Lists.Remote.List').data.add(repository);
                                    trackingRepositoriesList.data.remove(trackingRepositoriesList.getSelectedId());

                                    updateStatusForTrackAndUntrackButtons();
                                })
                            ;
                        })
                    ;
                }
            });
        }

        /**
         * Function to enable/disable a button
         * @param string  buttonId Button identifier
         * @param boolean status   Final status for the button
         */
        function enableButton(buttonId, status)
        {
            var fnName = (status ? 'en' : 'dis') + 'able';

            $$(buttonId)[fnName]();
        }

        /**
         * Function to change the status of track and untrack buttons
         */
        function updateStatusForTrackAndUntrackButtons()
        {
            var remoteRepositoriesList = $$('App.AccountDetails.Repositories.Lists.Remote.List');
            enableButton('App.AccountDetails.Repositories.Lists.Track.Button', !!remoteRepositoriesList.getSelectedItem());
            remoteRepositoriesList.data.sort('_name', 'asc');

            var trackingRepositoriesList = $$('App.AccountDetails.Repositories.Lists.Tracking.List');
            enableButton('App.AccountDetails.Repositories.Lists.Untrack.Button', !!trackingRepositoriesList.getSelectedItem());
            trackingRepositoriesList.data.sort('_name', 'asc');
        }

        /**
         * Function to initialize the list of repositories
         * @param Entity.Repository[] remoteRepositories   List of remote repositories
         * @param Entity.Repository[] trackingRepositories List of tracked repositories
         */
        function initializeRepositories(remoteRepositories, trackingRepositories)
        {
            Service.PageManager.switchView(_templateRepositories);

            var remoteRepositoriesList = $$('App.AccountDetails.Repositories.Lists.Remote.List');
            remoteRepositoriesList.data.clearAll();
            remoteRepositoriesList.parse(remoteRepositories);
            remoteRepositoriesList.attachEvent('onSelectChange', updateStatusForTrackAndUntrackButtons);

            var trackingRepositoriesList = $$('App.AccountDetails.Repositories.Lists.Tracking.List');
            trackingRepositoriesList.data.clearAll();
            trackingRepositoriesList.parse(trackingRepositories);
            trackingRepositoriesList.attachEvent('onSelectChange', updateStatusForTrackAndUntrackButtons);
            trackingRepositoriesList.attachEvent('onItemClick', configureAccount);

            $$('App.AccountDetails.Repositories.Lists.Track.Button').attachEvent('onItemClick', accountDetailsRepositoriesRepositoriesTrackButtonEvtClick);
            $$('App.AccountDetails.Repositories.Lists.Untrack.Button').attachEvent('onItemClick', accountDetailsRepositoriesRepositoriesUntrackButtonEvtClick);

            updateStatusForTrackAndUntrackButtons();
        }

        /**
         * Function to load the repositories
         */
        function loadRepositories()
        {
            Service.GetRepositories.findByAccount(_account)
                .done(function (remoteRepositories, trackingRepositories) {
                    if (!_destroyed) {
                        initializeRepositories(remoteRepositories, trackingRepositories);
                    }
                })
                .fail(null, loadRepositories)
            ;
        }

        /**
         * Function to initialize the account
         * @param string id Id to replace
         */
        me.init = function (id)
        {
            Service.PageManager.switchView(_templateLoading);
            loadRepositories();
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
