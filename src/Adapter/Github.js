(function (Adapter, Util) {
    // Set the object namespace
    Adapter.Github = {};

    /**
     * Base URL for the API
     * @type string
     */
    var baseUrl = 'https://api.github.com';

    /**
     * Function to make a GET AJAX call to Github
     * @param string      url      URL to call
     * @param string|null token    Token to make the request with
     * @return Util.Promise Promise object
     */
    Adapter.Github.get = function (url, token)
    {
        var promise = new Util.Promise();

        var xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                switch (xmlHttp.status) {
                    case 0:
                        promise.reject('adapter.github.noNetwork');
                        break;

                    case 200:
                        response = xmlHttp.responseText;

                        promise.resolve(JSON.parse(response));
                        break;

                    case 401:
                        promise.reject('adapter.github.invalidToken');
                        break;

                    default:
                        promise.reject('adapter.github.undefined');
                        break;
                }
            }
        };

        xmlHttp.open('GET', baseUrl + url, true);

        if (token) {
            xmlHttp.setRequestHeader('Authorization', 'token ' + token);
        }

        xmlHttp.send();

        return promise;
    };
})(window.Adapter = window.Adapter || {}, window.Util);
