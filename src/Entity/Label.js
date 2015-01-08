(function (Entity) {
    /**
     * Repository class
     * @param string name Label's name
     */
    Entity.Label = function (name)
    {
        /**
         * The object instance
         * @type Repository
         */
        var me = this;

        /**
         * ID
         * @type string
         */
        me._id = null;

        /**
         * Name
         * @type string
         */
        me._name = name;

        /**
         * Background color
         * @type string
         */
        me._color = '000000';

        /**
         * Name getter
         * @return string Entity's name
         */
        me.getName = function ()
        {
            return me._name;
        };

        /**
         * Function to set the color
         * @param string color Label's color
         */
        me.setBgColor = function (color)
        {
            me._color = color;
        };

        /**
         * Function to get the background color
         * @return string Label's background color
         */
        me.getBgColor = function ()
        {
            return me._color;
        };

        /**
         * Function to get the foreground color
         * @return string Label's foreground color
         */
        me.getFgColor = function ()
        {
            var red = parseInt(me._color.substr(0, 2), 16);
            var green = parseInt(me._color.substr(2, 2), 16);
            var blue = parseInt(me._color.substr(4), 16);

            var perceptiveLuminance = 1 - (0.299 * red + 0.587 * green + 0.114 * blue)/255;

            if (perceptiveLuminance < 0.5) {
                return '282d33';
            } else {
                return 'ffffff';
            }
        };

        /**
         * Function to know if two labels are the same
         * @param  Entity.Label label Label to compare with
         * @return bool               Wheather both labels are the same or not
         */
        me.equals = function (label)
        {
            return (me._name === label.getName());
        };
    };
})(window.Entity = window.Entity || {});
