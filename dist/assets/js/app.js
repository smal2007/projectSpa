var app = (function($, cont) {

    var regEmail = $("#inputEmailReg");
    var regPass = $("#inputPasswordReg");
    var loginEmail = $("#inputEmailLogin");
    var loginPass = $("#inputPasswordLogin");

    var APPLICATION_ID = '005B0AD0-3D76-48F4-FF85-296C0438F200',
        SECRET_KEY = '3A2A9558-A762-E6A6-FF7D-51D1C5AA3200',
        VERSION = 'v1'; //default application version;


    Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);

    var curUser = "";
    $("#modal-button-registration").on("click", function() {
        var user = new Backendless.User();
        user.email = regEmail.val();
        user.password = regPass.val();
        console.log(user);
        Backendless.UserService.register(user, new Backendless.Async(app.userRegistration, app.gotError));
    });

    $("#modal-button-login").on("click", function() {
        var login = loginEmail.val();
        var pass = loginPass.val();
        console.log(login + pass);
        Backendless.UserService.login(login, pass, true, new Backendless.Async(app.userLoggedIn, app.gotError));
    });

    $('#main-logout').on("click", function() {
        $('.box_for_tel1 div').remove();
          Backendless.UserService.logout(new Backendless.Async(app.userLoggedout, app.gotError));
        //Backendless.UserService.logout();

    });


    $(document).ready(function() {
        // Backendless.UserService.logout(new Backendless.Async(app.userLoggedout, app.gotError));
        app.checkUser();

    });

    function setTimeOutNotice(obj) {
        setTimeout(function() {
            obj.children().fadeOut("slow");
        }, 3000);
    }



    var initialized = false; // флаг, инициализировано наше приложение или нет
    var $window = $(window); // ссылка на объект window, чтобы вызывать постоянно jquery

    var pages = {}; // ассоциативный массив с описаием страниц src - адрес подгружаемого html, js - адрес подгружаемого js, ключ - hash

    var renderState = function() {
        cont.html(app.state.html);
    }

    var changeState = function(e) {
        // записываем текущее состояние в state
        app.state = pages[window.location.hash];
        // вот тут может выдаваться ошибка "Cannot read property 'init' of undefined". 
        // подумайте, почему происходит ошибка и как от этого можно избавиться?
        app.state.module.init(app.state.html);

        //$('nav a[herf=+window.location.hash+')
        $('#pages>li>a').each(function() {
            if ($(this).attr('data-src') == app.state.src) {
                $(this).addClass("active");
            }
            else {
                $(this).removeClass("active");
            }
        });
        renderState();
    }

    return {

        userRegistration: function(user) {
            $(".modal-dialog .close").click();
            var notice = $("#notification");
            notice.append('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success! </strong>User ' + user.email + ' has been registered.</div>');
            setTimeOutNotice(notice);
        },
        userLoggedIn: function(user) {
            $(".modal-dialog .close").click();
            curUser = user.email;
            app.checkUser();
            var notice = $("#notification");
            notice.append('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success! </strong>User ' + user.email + ' has been login.</div>');
            setTimeOutNotice(notice);
        },
        checkUser: function() {
            curUser = Backendless.UserService.getCurrentUser();
            if (curUser != null) {
                $('.addtocart').show();
                $('a[href="#/registration"]').show();
                $("#main-registration").hide();
                $("#main-login").hide();
                $('#main-logout').show();
                $("#current-user").text("Добро пожаловать, " + curUser.email);
            }
            else {
                //   ar linksToGoogle = $('a[href="http://google.com"]');
                $('.addtocart').hide();
                $('a[href="#/registration"]').hide();
                $("#main-registration").show();
                $("#main-login").show();
                $('#main-logout').hide();
                $("#current-user").text("");
            }
        },
        userLoggedout: function(user) {

            window.location = "#/";
            var notice = $("#notification");
            notice.append('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success! </strong>User ' + curUser.email + ' has been logout.</div>');

            setTimeOutNotice(notice);
            app.checkUser();

        },
        gotError: function(err) {
            var notice = $("#notification");
            notice.append(' <div class="alert alert-danger fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error! </strong>' + err.message + '.</div>');

            setTimeOutNotice(notice);
        },
        init: function() {

            $(cont.data('pages')).find('li>a').each(function() {
                var href = $(this).attr("href");

                pages[href] = {
                    src: $(this).data("src"),
                    js: $(this).data("js"),
                };

                $.ajax({
                    url: pages[href].src,
                    method: "GET",
                    dataType: "html",
                    async: false,
                    success: function(html) {
                        pages[href].html = $(html); // подумайте, почему так?
                        $.ajax({
                            url: pages[href].js,
                            method: "GET",
                            async: false,
                            dataType: "script",
                            success: function(js) {
                                pages[href].module = app.currentModule;
                            }
                        });
                    }
                });
            });

            /*  $(cont.data('pages')).find("#")*/

            this.state = {} // текущее состояние
            window.location.hash = window.location.hash || "#/";
            $window.on('hashchange', changeState);
            if (!initialized) {
                $window.trigger('hashchange');
            }
            initialized = true;
        },

        debug: function() {
            console.log(pages);
        }


    }


})(jQuery, $('#app'));

app.init();