(function (Page) {
    /**
     * AddAccountGithub page
     */
    Page.AddAccountGithub = function ()
    {
        /**
         * The object instance
         * @type Page.AddAccountGithub
         */
        var me = this;

        /**
         * Add github account template
         * @type object
         */
        var _template = Templates.AddAccount.Github;

        /**
         * Function to enable or disable controlls
         * @param boolean status Final status for controlls
         */
        function enableControlls(status)
        {
            var fnName = (status ? 'en' : 'dis') + 'able';

            $$('App.AddAccount.Github.Token.Input')[fnName]();
            $$('App.AddAccount.Github.Save.Button')[fnName]();
        }

        /**
         * Function to verify the supplied token
         * @param  string  token Token to verify
         * @return boolean       Wheather is valid or not
         */
        function assertToken(token)
        {
            if (!!token) {
                return Util.Promise.buildResolved();
            } else {
                return Util.Promise.buildRejected('page.addAccountGithub.emptyToken');
            }
        }

        /**
         * Function to assert uniquity of the account being added
         * @param  Entity.Account account Account being added
         * @return Util.Promise           Promise object
         */
        function assertUniquity(account)
        {
            var promise = new Util.Promise();

            Persister.Accounts.find(account.getId())
                .done(function (existing) {
                    if (existing) {
                        promise.reject('page.addAccountGithub.accountAlreadyRegistered');
                    } else {
                        promise.resolve();
                    }
                })
            ;

            return promise;
        }

        /**
         * Function to save the account
         */
        function saveAccount()
        {
            var token = $$('App.AddAccount.Github.Token.Input').getValue();

            enableControlls(false);
            assertToken(token)
                .done(function() {
                    return Adapter.Accounts.findByToken(token)
                        .done(function (account) {
                            account.setToken(token);

                            return assertUniquity(account)
                                .done(function () {
                                    return Persister.Accounts.save(account)
                                        .done(function() {
                                            Service.PageManager.init(account);
                                            enableControlls(true);
                                        })
                                    ;
                                })
                            ;
                        })
                    ;
                })
                .fail('adapter.github.noNetwork', function () {
                    webix.message({type: 'error', text: 'You are currently offline. Please, try again later.'});
                    enableControlls(true);
                })
                .fail('page.addAccountGithub.accountAlreadyRegistered', function() {
                    webix.message({type: 'error', text: 'This account is already registered.'});
                    enableControlls(true);
                })
                .fail('page.addAccountGithub.emptyToken', function () {
                    webix.message({type: 'error', text: 'The token cannot be empty.'});
                    enableControlls(true);
                })
                .fail(null, function () {
                    webix.message({type: 'error', text: 'The suplied token is not valid.'});
                    enableControlls(true);
                })
            ;
        }

        /**
         * Function to initialize the account
         * @param string id Id to replace
         */
        me.init = function (id)
        {
            Service.PageManager.switchView(_template);

            $$('App.AddAccount.Github.Save.Button').attachEvent('onItemClick', saveAccount);
            $$('App.AddAccount.Github.Token.Input').attachEvent('onKeyPress', function (code) {
                if (code === 13) {
                    saveAccount();
                }
            });
        };

        /**
         * Function to set this page as being destroyed
         */
        me.destroy = function ()
        {
            // Nothing required here
        };
    };
})(window.Page = window.Page || {});
