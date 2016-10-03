app.currentModule = (function($) {
    Backendless.initApp("B08630AE-F0DB-F308-FF82-01D4899A5E00", "D666283F-99D3-A4EF-FF8F-DD9DDA74E100", "v1");

    // get objectId of the logged-in user:
    var userObjectId = Backendless.LocalCache.get("current-user-id")

    // get user-token of the logged-in user:
    var userToken = Backendless.LocalCache.get("user-token")
    console.log(userToken)

    // get current user object:
    var userObject = Backendless.UserService.getCurrentUser();
    console.log(userObject);
    return {
        init: function(obj, callback) {
            console.log("Инициализируем модуль для главной страницы");
            obj = obj || new Object(null);
            callback = callback || function() {
                return false;
            }

            var butId;
            var objData;
            var reg_name = /.{5,10}/ig;
            var reg_password = /\w{5,10}/ig;



            $(obj).find('.sign').on("click", function showForm() {
                console.log('ok');
                $('.form').toggle();
                $('.choise').toggle();

                if (this.tagName != 'SPAN') {
                    $('div.form input[type = button]').val(this.innerHTML);
                    console.log('equal span')
                    butId = this.id;
                    $('.box').append('<span class="icon">');
                    $('span.icon').html('<i class="fa fa-reply" aria-hidden="true"></i>')
                    $('span.icon').on('click', showForm)
                }
                else if (this.tagName == 'SPAN') {
                    $(this).css('display', 'none')
                }
            })

            $(obj).find('input[type = button]').on('click', function makeObjData() {
                console.log($('input[name = first_name]').val());
                if ($('input[name = first_name]').val().match(reg_name) &&
                    $('input[name = password]').val().match(reg_password)) {
                    objData = {};
                    objData.name = $('input[name = first_name]').val();
                    objData.password = $('input[name = password]').val();
                    objData = JSON.stringify(objData);
                    if (butId == 'sign_in') {
                        sign_in()
                    }
                    else if (butId == 'sign_up') {
                        sign_up()
                    }
                    else console.log(butId)
                }
                else {
                    alert('try again')
                }


            })

            function sign_in() {
                // $.ajax({
                //     url: 'https://api.backendless.com/v1/data/registredUsers',
                //     headers: {
                //         'application-id': "B08630AE-F0DB-F308-FF82-01D4899A5E00",
                //         'secret-key': "D666283F-99D3-A4EF-FF8F-DD9DDA74E100"
                //     },
                //     success: function(data) {
                //         console.log(data.data)
                //         var dataFromServer = data.data;

                //         for (var i = 0; i < dataFromServer.length; i++) {
                //             if (dataFromServer[i].name == $('input[name = first_name]').val() && dataFromServer[i].password == $('input[name = password]').val()) {
                //                 $('.box').html('')
                //             }

                //         }
                //     }
                // })
                Backendless.UserService.login($('input[name = first_name]').val(), $('input[name = password]').val(), true);
                

            }

            function sign_up() {
                // $.ajax({
                //     url: 'https://api.backendless.com/v1/data/registredUsers',
                //     type: 'POST',
                //     data: objData,
                //     contentType: 'application/json',
                //     headers: {
                //         'application-id': "B08630AE-F0DB-F308-FF82-01D4899A5E00",
                //         'secret-key': "D666283F-99D3-A4EF-FF8F-DD9DDA74E100"
                //     },
                //     success: function(data) {
                //         $('.box').append('<div id="reg_complete" class="alert alert-success" role="alert"></div>');
                //         $('#reg_complete').html('Registration complete!!! Sign in please!!!')
                //         butId = 'sign_in';
                //         $('div.form input[type = button]').val('sign in');

                //         objData.name = $('input[name = first_name]').val('');
                //         objData.password = $('input[name = password]').val('');

                //         console.log(data)
                //     }
                // })
                var user = new Backendless.User();
                user.email = $('input[name = first_name]').val();
                user.password = $('input[name = password]').val();
                console.log(user, Backendless);
                Backendless.UserService.register(user);
            }


            console.log('load')

            callback();

        },

    }
})(jQuery);

/*$('input[type=text]').each(function() {
    objData[$(this).attr('name')] = $(this).val()
})*/