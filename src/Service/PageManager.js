(function (Service) {
    // Set the object namespace
    Service.PageManager = {};

    /**
     * Current page
     * @type object
     */
    var currentPage = null;

    /**
     * Current view object
     * @type object
     */
    var currentView = null;

    /**
     * Function to change the currently displayed account
     */
    function changeAccount()
    {
        var account = $$('App.Accounts.List').getSelectedItem();

        if (account.getType() === 'plus') {
            Service.PageManager.switchPage(new Page.AddAccountGithub());
        } else {
            Service.PageManager.switchPage(new Page.AccountDetailsRepositories(account));
        }
    }

    /**
     * Function to switch the page's view
     * @param object view Object containing the view details
     */
    Service.PageManager.switchView = function (view)
    {
        var id = (currentView ? currentView.id : 'App.Placeholder');

        currentView = view;
        webix.ui(currentView, $$(id));
    };

    /**
     * Function to load a page object
     * @param Page page Page object to be loaded
     */
    Service.PageManager.switchPage = function (page)
    {
        if (currentPage) {
            currentPage.destroy();
        }

        currentPage = page;
        currentPage.init();
    }

    /**
     * Function to switch the selected account
     * @param Entity.Account account Account to switch to
     */
    Service.PageManager.switchAccount = function (account)
    {
        var accountsList = $$('App.Accounts.List');

        for (var i = 0; i < accountsList.data.count(); i++) {
            var id = accountsList.getIdByIndex(i);
            var accountInList = accountsList.getItem(id);

            if (accountInList.equals(account)) {
                accountsList.select(id);
            }
        }
    };

    /**
     * Function to initialize the component
     * @param Entity.Account account Account to switch to
     */
    Service.PageManager.init = function(account)
    {
        Persister.Accounts.findAll()
            .done(function (accounts) {
                accounts.push(new Entity.Account(0, 'Add account', 'plus'));

                var accountsList = $$('App.Accounts.List');
                accountsList.data.clearAll();
                accountsList.parse(accounts);
                accountsList.attachEvent('onSelectChange', changeAccount);

                if (account) {
                    Service.PageManager.switchAccount(account);
                } else {
                    Service.PageManager.switchAccount(accountsList.getItem(accountsList.getFirstId()));
                }
            })
        ;
    };
})(window.Service = window.Service || {});
