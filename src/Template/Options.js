(function (Templates) {
    /**
     * Declare AddAccount namespace
     * @type object
     */
    Templates.AddAccount = {};

    /**
     * Declare AccountDetails namespace
     * @type object
     */
     Templates.AccountDetails = {
        Repositories: {},
        Labels: {}
     };

    /**
     * Url for new token generation on github
     * @type string
     */
    var GITHUB_NEW_TOKEN_URL = 'https://github.com/settings/tokens/new';

    /**
     * Function to center content
     * @param  string id      Object's ID (optional)
     * @param  object content Content to be centered
     * @return object Content centered
     */
    function centerContent(id, content)
    {
        return {
            id: id,
            height: '100%',
            rows: [{}, {cols: [{}, content, {}]}, {}]
        };
    }

    /**
     * Function to get a centered loading animation
     * @param  string id Object's ID
     * @return object    Loading animation
     */
    function getLoadingAnimation(id)
    {
        return centerContent(id, {
            view: 'label',
            label: '<span class="webix_icon fa-circle-o-notch fa-spin big_spin"></span>',
            width: 45,
            height: 45
        });
    }

    /**
     * Function to get an icon button
     * @param  string  id       Element ID
     * @param  string  icon     Icon name
     * @param  boolean disabled Weather to make the button disabled or not
     * @return object           Button object
     */
    function getIconButton(id, icon, disabled)
    {
        return {
            id: id,
            view: 'button',
            type: 'iconButton',
            icon: icon,
            css: 'btn_center_text',
            disabled: !!disabled
        };
    }

    /**
     * Accounts list
     * @type object
     */
    var accountsList = {
        id: 'App.Accounts.List',
        view: 'list',
        scroll: false,
        css: 'accounts_list',
        select: true,
        width: 200,
        template: function (account) {
            return '<span class="webix_icon fa-' + account.getType() + '"></span>' + account.getName();
        },
        data: []
    };

    /**
     * Main app structure
     * @type object
     */
    Templates.app = {
        type: 'space',
        height: '100%',
        rows: [
            {
                type:'header',
                template: '<span class="webix_icon fa-cog"></span>Pull Requests Notifier - Settings page'
            },
            {
                height: '100%',
                cols: [
                    accountsList,
                    {
                        css: 'white_bg',
                        rows: [{id: 'App.Placeholder'}]
                    }
                ]
            }
        ]
    };

    /**
     * Add github account elements
     * @type object
     */
    Templates.AddAccount.Github = centerContent('App.AddAccount.Github', {
        view: 'form',
        width: 320,
        borderless: true,
        elements: [
            {view: 'label', label: '<h2><span class="webix_icon fa-github"></span>Github account</h2>', align: 'center', autoheight: true},
            {view: 'label', label: 'Follow <a href="' + GITHUB_NEW_TOKEN_URL + '" target="_blank">this link</a> to create one and paste it below', align: 'center'},
            {view: 'text', placeholder: 'Paste access token here', id: 'App.AddAccount.Github.Token.Input'},
            {view: 'button', value: 'Save', type: 'form', id: 'App.AddAccount.Github.Save.Button'}
        ]
    });

    /**
     * Account details loading
     * @type object
     */
    Templates.AccountDetails.Loading = getLoadingAnimation('App.AccountDetails.Loading');

    /**
     * Account details repositories
     * @type object
     */
    Templates.AccountDetails.Repositories.Lists = {
        id: 'App.AccountDetails.Repositories.Lists',
        view: 'layout',
        type: 'space',
        css: 'white_bg',
        height: '100%',
        cols: [
            {
                rows: [
                    {view: 'label', template: 'Remote repositories:'},
                    {
                        id: 'App.AccountDetails.Repositories.Lists.Remote.List',
                        view: 'list',
                        template: function (repository) {
                            var item = repository.getName();

                            if (repository.getOrganization()) {
                                item = repository.getOrganization().getName() + '/' + item;
                            }

                            return item;
                        },
                        data: [],
                        select: true
                    }
                ]
            },
            {
                width: 40,
                rows: [
                    {},
                    getIconButton('App.AccountDetails.Repositories.Lists.Track.Button', 'angle-right', true),
                    getIconButton('App.AccountDetails.Repositories.Lists.Untrack.Button', 'angle-left', true),
                    {}
                ]
            },
            {
                rows: [
                    {view: 'label', template: 'Tracking repositories:'},
                    {
                        id: 'App.AccountDetails.Repositories.Lists.Tracking.List',
                        view: 'list',
                        template: function (repository) {
                            var item = repository.getName();

                            if (repository.getOrganization()) {
                                item = repository.getOrganization().getName() + '/' + item;
                            }

                            item += '<span class="config">Configure</span>';

                            return item;
                        },
                        data: [],
                        select: true
                    }
                ]
            }
        ]
    };

    /**
     * Account details labels
     * @type object
     */
    Templates.AccountDetails.Labels.Configuration = {
        id: 'App.AccountDetails.Labels.Configuration',
        view: 'layout',
        type: 'space',
        css: 'white_bg',
        height: '100%',
        rows: [
            {
                cols: [
                    {
                        id: 'App.AccountDetails.Labels.Configuration.Back.Button',
                        view: 'button',
                        type: 'iconButton',
                        icon: 'chevron-left',
                        label: 'Back',
                        width: 80
                    },
                    {},
                    {view: 'label', template: '', id: 'App.AccountDetails.Labels.Configuration.Name.Label'},
                    {}
                ]
            },
            {view: 'label', template: 'A Pull Request is ready for review when...'},
            {
                id: 'App.AccountDetails.Labels.Configuration.Discriminator.Radio',
                view: 'radio',
                name: '',
                label: '',
                options: [
                    {value: '... all of ...', id: Entity.Repository.DISCRIMINATOR_ALL_OF},
                    {value: '... at least one of ...', id: Entity.Repository.DISCRIMINATOR_AT_LEAST_ONE_OF},
                    {value: '... none of ...', id: Entity.Repository.DISCRIMINATOR_NONE_OF}
                ]
            },
            {view: 'label', template: '... the following labels are attached to it:'},
            {
                id: 'App.AccountDetails.Labels.List',
                view: 'list',
                select: 'multiselect',
                css: 'labels_list',
                template: function (label, clone, info) {
                    return [
                        '<div class="label">',
                            '<span class="unchecked webix_icon fa-square-o"></span>',
                            '<span class="checked webix_icon fa-check-square-o"></span>',
                            '<span class="name" style="background-color: #' + label.getBgColor() + '; color: #' + label.getFgColor() + ';">',
                                '<span class="webix_icon fa-tag"></span>',
                                label.getName(),
                            '</span>',
                        '</div>'
                    ].join('');
                },
                data:[]
            }
        ]
    };
})(window.Templates = {});
