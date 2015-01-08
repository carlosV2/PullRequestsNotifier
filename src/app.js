// Function to fire up the application
webix.ready(function () {
    webix.ui.fullScreen();
    webix.ui(Templates.app);

    Service.PageManager.init();
});
