app.currentModule = (function($) {



    return {
        init: function(obj, callback) {
            var categoryId;
            var price;
            console.log(categoryId)
            console.log("Инициализируем модуль главной страницы");
            obj = obj || new Object(null);
            callback = callback || function() {
                return false;
            }


            var categoryId;
            $.ajax({
                url: 'https://api.backendless.com/v1/data/category',
                headers: {
                    "application-id": "005B0AD0-3D76-48F4-FF85-296C0438F200",
                    "secret-key": "3A2A9558-A762-E6A6-FF7D-51D1C5AA3200"
                },
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    $('.list').html('');
                    var prependURI = 'where=categoryId.objectId%3D%27';
                    var appendURI = '%27';
                    var categories = data.data;
                    // Создаем первый ел.списка для пролучения всех категорий товаров. Вызываем getData БЕЗ аргумента с названием категории.
                    /*   var li = $(' <li id="li_all_categories" class="btn btn-default active">все категории</li>');
                       $('.list').append(li);
                       li.on('click', function() {
                               $('.list li').removeClass('active');
                               $(this).addClass('active');
                               categoryId = '';
                               getData();
                           });*/
                    //Создаем список в ДОМ имеющися категорий
                    for (var i = -1; i < categories.length; i++) {
                        categories[i] = categories[i] || {};
                        if (categories[i].name == undefined) categories[i].name = 'все категории';
                        if (categories[i].objectId == undefined) categories[i].objectId = '';
                        var li = $('<li class="item btn btn-default" data-category_id ="' + categories[i].objectId + '">' + categories[i].name + '</li>');
                        //Вешаем на каждый элемент списка получение элементов категории
                        li.on("click", function changeCategory() {
                            console.log($(this).text());
                            categoryId = $(this).data('category_id');
                            if (categoryId == '') {
                                categoryId = '';
                            }
                            else {
                                categoryId = prependURI + categoryId + appendURI
                            }
                            $('.list li').removeClass('active');
                            $(this).addClass('active')
                            getData();

                        });

                        $('.list').append(li);


                    }
                    $.ajax({
                        url: 'https://api.backendless.com/v1/data/vendors',
                        headers: {
                            "application-id": "005B0AD0-3D76-48F4-FF85-296C0438F200",
                            "secret-key": "3A2A9558-A762-E6A6-FF7D-51D1C5AA3200"
                        },
                        type: 'GET',
                        dataType: 'json',
                        success: function(data) {
                            var vendors = data.data;
                            for (i = 0; i < vendors.length; i++) {
                                var li = $('<li class="vendor" data-vendor_id="' + vendors[i].objectId + '" ><label> <input name="vendors" type="radio"> ' + vendors[i].name + ' </label> </li>');
                                $(li).on('click', function() {
                                    console.log($(this).data('vendor_id'))
                                })
                                $('.vendors').append(li)
                            }

                        }
                    })

                }
            });




            obj.find("#btnSort").on('click', function() {
                if (price == 'sortBy=price%20asc&') {
                    $('#icon').removeClass();
                    $('#icon').addClass('glyphicon glyphicon-arrow-down')
                    price = 'sortBy=price%20desc&';
                    getData()
                }
                else {
                    $('#icon').removeClass();
                    $('#icon').addClass('glyphicon glyphicon-arrow-up')
                    price = 'sortBy=price%20asc&';
                    getData()

                }




            });


           /* function fixedEncodeURIComponent(str) {
                return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
                    return '%' + c.charCodeAt(0).toString(16);
                });
            }*/



            /* obj.find('#li_all_categories').on('click', function() {
                 $(this).addClass('active')
                 getData()
             })*/


            /*var getData =*/
            function getData() {
                console.log(categoryId)


                categoryId = categoryId || '';
                price = price || '';
                console.log(categoryId)
                console.log(price)
                $.ajax({
                    url: 'https://api.backendless.com/v1/data/items?' + price + categoryId,
                    complete: function() {
                        console.log(categoryId)
                    },
                    headers: {
                        "application-id": "005B0AD0-3D76-48F4-FF85-296C0438F200",
                        "secret-key": "3A2A9558-A762-E6A6-FF7D-51D1C5AA3200"
                    },
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        var dataPhones = data.data;
                        $('.box_for_tel').html('');
                        for (var i = 0; i < dataPhones.length; i++) {
                            $('.box_for_tel').append('<div class="tel col-sm-4 col-md-3" data-count="' + i + '">')
                            var tel = $('.tel')[i];
                            $(tel).append('<div class=" tel_thumbnail thumbnail" data-toggle="modal" data-target="#myModal">');
                            var tel_thumbnail = $('.tel_thumbnail')[i];
                            $(tel_thumbnail).append("<img class='foto' src='" + dataPhones[i].image + "'>");
                            $(tel_thumbnail).append('<h3>' + dataPhones[i].title + '</h3>');
                            $(tel_thumbnail).append('<h3>' + dataPhones[i].price + ' $</h3>');

                            $(tel).on('click', function() {
                                var currentDataTel = dataPhones[$(this).data('count')]
                                console.log();
                                $('#myModalLabel').html(currentDataTel.title);
                                $('.modal-body').html('<img class="modal_foto" src="' + currentDataTel.image + '">');
                                $('.modal-body').append('<p>' + currentDataTel.fullDescription + '</p>')
                            })



                        }
                        console.log(data.data)
                    }

                })
            }
            getData()

            callback();
        }
    }
})(jQuery);