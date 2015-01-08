// Stuff that needs to be executed after the DOM is ready
webix.ready(function () {
    renderDataPage();
    /*AuthTokenRepository.isset(function (result) {
        if (result) {
            renderDataPage();
        } else {
            renderTokenMissingPage();
        }
    });*/
});

/**
 * Function to render the missing token page
 */
function renderTokenMissingPage()
{
    // Compose the page structure
    webix.ui({
        id: 'token_missing_form',
        view: 'form',
        width: 325,
        elements: [
            {view: 'label', label: '<strong>No access token found</strong>'},
            {view: 'label', label: 'Follow <a href="https://github.com/settings/tokens/new" id="token_missing_link">this link</a> to create one and paste it below:'},
            {view: 'text', placeholder: 'Paste access token here', id: 'token_missing_input'},
            {view: 'label', label: '<span class="red">The suplied token is not valid</strong>', id: 'token_missing_notification', hidden: true},
            {view: 'button', value: 'Save', type: 'form', click: 'tokenMissingSave'}
        ]
    });

    // Open a new tab when user click on a link
    document.getElementById('token_missing_link').onclick = function()
    {
        chrome.tabs.create({url: this.href});
    };
}

/**
 * Function to render the data page
 */
function renderDataPage()
{
    // Compose the page structure
    webix.ui({
        width: 700,
        height: 550,
        rows: [
            {
                view: 'toolbar', elements: [
                    {view: 'label', label: 'Pull Requests Notifier'},
                    {},
                    {view: 'icon', icon: 'cog', id: 'settings', click: 'openOptionsPage'}
                ]
            },
            {},
            {view: 'label', label: '<span class="grey">No repositories configured.</span>', align: 'center'},
            {}
            /*{cols: [
                {
                    view: 'list',
                    width: 100,
                    minWidth: 100,
                    maxWidth: 300,
                    template: '#name# <span class="notification">#notifications#</span>',
                    data: [
                        {name: 'ReChannel', notifications: 2},
                        {name: 'ReChannel-FE', notifications: 0},
                        {name: 'Apiary', notifications: 8}
                    ]
                },
                {view: 'resizer'},
                {template: 'col2'}
            ]}*/
        ]
    });

    //document.getElementById('s')
}

/**
 * Function to open the options page
 */
function openOptionsPage()
{
    chrome.tabs.create({url: 'html/options.html'});
}