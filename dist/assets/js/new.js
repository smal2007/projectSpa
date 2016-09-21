app.currentModule = (function($){
    return {
        init: function(obj, callback) {
            console.log("Инициализируем модуль для главной страницы");
            obj = obj || new Object(null);
            callback = callback || function() {
                return false;
            }
            
            callback();
        }
    }
})(jQuery);