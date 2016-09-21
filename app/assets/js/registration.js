app.currentModule = (function($) {
    var cfg = {
        url: "https://api.backendless.com/v1/data/family",
        id: "8C75EE00-12BF-1292-FF8F-EBEDE65D5500",
        key: "C11E5441-DCBF-0BFB-FFA6-E7CEC369C500"
    }
    return {
        init: function(obj, callback) {
            console.log("Инициализируем модуль для регистрации страницы");
            obj = obj || new Object(null);
            callback = callback || function() {
                return false;
            }

         

            obj.find("input[type=button]").off("click").on("click", function() {
                var to_send = {
                   login: obj.find("input[name=Login]").val(),
                   password: obj.find("input[name=Password]").val(),
                }
                $.ajax({
                    url: "https://api.backendless.com/v1/data/grats",
                    method: "POST",
                    headers: {
                        "application-id": "3FDE63EC-7557-F093-FFB3-33819E755600",
                        "secret-key": "891D9767-23FD-D406-FF74-F645A6791700"
                    },
                    contentType: "application/json",
                    data: JSON.stringify(to_send)
                });
            });


            callback();
        }
    }

})(jQuery);
