app.currentModule = (function($) {
    var objItems = {};
    var currentCategoryId = "";
    var tagsMobile = {};
    var objSearch = {};





    function seachItems(obj) {
        var callback = new Backendless.Async(handleResponseTag, handleFault);
        obj = obj || new Object();
        obj.pageSize = obj.pageSize || 6;
        obj.title = obj.title || "";
        var itemsStorage = Backendless.Persistence.of('items');
        var dataQuery = {
            options: {
                pageSize: obj.pageSize
            },
            condition: "title LIKE '%" + obj.title + "%'",
        };
        itemsStorage.find(dataQuery, callback);
    }


    $(window).on('hashchange', function(e) {
        $(document).ready(function() {

            findTag(objItems);

        });
    }).trigger('hashchange');

    $(".pagination").on("pagechange", function(event) {
        console.log("click");
    });


    $(function() {
        var curUser = "";
        console.log(curUser);
        curUser = Backendless.UserService.getCurrentUser();
        if (curUser != null) {
            $('.addtocart').show();
        }
        else {
            $('.addtocart').hide();
        }
    });

    $(function() {
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: 2000,
            values: [0, 2000],
            slide: function(event, ui) {
                $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
            },
            change: function(e, ui) {
                objItems.startPrice = ui.values[0];
                objItems.endPrice = ui.values[1];
                findTag(objItems);
            }
        });
        $("#amount").val("$" + $("#slider-range").slider("values", 0) +
            " - $" + $("#slider-range").slider("values", 1));
    });

    $(document).ready(function() {
        findVendors(objItems);
    });


    function addToCart(objectId1) {
        console.log('added');
        var dataStore = Backendless.Persistence.of('cart');
        var cond = "itemId='" + objectId1 + "'";
        console.log(cond);
        var dataQuery = {
            condition: cond,
        }
        var myContact = dataStore.find(dataQuery);
        console.log(myContact.data.length);

        // console.log(myContact.data[0].objectId);
        if (myContact.data.length > 0) {
            console.log('a');
            var count = myContact.data[0].count;
            var commentObject1 = new Cart1({
                count: count + 1,
                itemId: objectId1,
                objectId: myContact.data[0].objectId,
            });
            dataStore.save(commentObject1);
        }
        else {
            var commentObject2 = new Cart2({
                count: 1,
                itemId: objectId1,
                ownerId: Backendless.UserService.getCurrentUser().objectId
            });
            Backendless.Persistence.of('cart').save(commentObject2);
        }

        function Cart1(args) {
            args = args || {};
            this.count = args.count || "";
            this.itemId = args.itemId || "";
            this.objectId = args.objectId || "";
        }

        function Cart2(args) {
            args = args || {};
            this.count = args.count || "";
            this.itemId = args.itemId || "";
        }
    }

    function handleResponseVendors(vendor) {
        $('.vendors li').remove();
        var newArr = [];
        var uniqueArray = [];
        var vendors = vendor.data;
        for (var i = 0; i < vendors.length; i++) {
            newArr[newArr.length] = vendors[i].vendorId.name;
        }

        uniqueArray = newArr.filter(function(item, pos) {
            return newArr.indexOf(item) == pos;
        });

        for (var i = 0; i < uniqueArray.length; i++) {
            var li = $('<li class="vendor"><label> <input name="vendors" type="checkbox"> ' + uniqueArray[i] + ' </label> </li>');
            $('.vendors').append(li);
            $(li).find('input[type="checkbox"]').checkboxradio({
                icon: false
            })
        }

        $('.vendors li label input[type="checkbox"]').change(function() {
            var vendArr = [];
            $(".vendors li label input:checked").each(function() {
                vendArr[vendArr.length] = $(this).parent().text().trim();
            });
            objItems.nameItems = vendArr;
            findTag(objItems);
        });
    }

    function findVendors(obj) {
        var callback1 = new Backendless.Async(handleResponseVendors, handleFault);
        var itemsStorage1 = Backendless.Persistence.of('items');
        var cond = "";
        obj = obj || new Object();
        obj.pageSize = obj.pageSize || 50;
        var dataQuery = {};
        if (currentCategoryId === undefined || currentCategoryId === "") {
            dataQuery = {
                options: {
                    pageSize: obj.pageSize
                }
            }
        }
        else {
            cond = "categoryId.objectId = '" + currentCategoryId + "'";
            dataQuery = {
                options: {
                    pageSize: obj.pageSize
                },
                condition: cond,
            }
        }
        itemsStorage1.find(dataQuery, callback1);
    }


    function myfun(i) {
        var tags = tagsMobile.slice((i) * 8, (i + 1) * 8);
        $('.box_for_tel').html('');
        for (var i = 0; i < tags.length; i++) {
            $('.box_for_tel').append('<div data-category_id="' + tags[i].objectId + '" class="tel col-xs-6 col-sm-6 col-md-4 col-lg-3" data-count="' + i + '">');
            var tel = $('.tel')[i];
            $(tel).append('<div class=" tel_thumbnail thumbnail">');
            var tel_thumbnail = $('.tel_thumbnail')[i];
            $(tel_thumbnail).append("<img class='foto' data-toggle='modal' data-target='#myModal' src='" + tags[i].image + "'>");
            $(tel_thumbnail).append('<h4>' + tags[i].title + '</h4>');
            $(tel_thumbnail).append('<input data-category_id="' + tags[i].objectId + '" class="addtocart btn btn-info" type="button" value="Добавить в корзину">').on("click", function() {
                console.log('object' + tags[i].objectId);
                addToCart(tags[i].objectId);
            });



            $(tel_thumbnail).append('<h3>' + tags[i].price + ' $</h3>');

            $(tel).on('click', function() {
                var currentDataTel = tags[$(this).data('count')];

                $('#myModalLabel').html(currentDataTel.title);
                $('.modal-body1').html('<img class="modal_foto" src="' + currentDataTel.image + '">');
                $('.modal-body1').append('<p>' + currentDataTel.fullDescription + '</p>');


            });
        }
    }

    function initPaginator(count) {
        var $pag = $('.pagination');
        $pag.find("li").remove();
        for (var i = 0; i < count; i++) {
            $pag.append('<li class="active"><a href="#/">' + (i + 1) + '<span class="sr-only">(current)</span></a></li>');
        }

        $('.pagination li a').each(function(i) {
            $(this).click(function() {
                myfun(i);
            });

        });
    }

    function handleResponseTag(tag) {
        console.log(tag);
        tagsMobile = tag.data;
        var count = tag.totalObjects / 8;
        initPaginator(count);
        var tags = tag.data;
        $('.box_for_tel').html('');
        for (var i = 0; i < 8; i++) {
            $('.box_for_tel').append('<div data-category_id="' + tags[i].objectId + '" class="tel col-xs-6 col-sm-6 col-md-4 col-lg-3" data-count="' + i + '">');
            var tel = $('.tel')[i];
            $(tel).append('<div class=" tel_thumbnail thumbnail">');
            var tel_thumbnail = $('.tel_thumbnail')[i];
            $(tel_thumbnail).append("<img class='foto pulse' data-toggle='modal' data-target='#myModal' src='" + tags[i].image + "'>");
            $(tel_thumbnail).append('<h4>' + tags[i].title + '</h4>');
            $(tel_thumbnail).append('<h3>' + tags[i].price + ' $</h3>');
            $(tel_thumbnail).append('<input data-category_id="' + tags[i].objectId + '" class="addtocart btn btn-info" type="button" value="Добавить в корзину">').on("click", function() {
                console.log('object' + tags[i].objectId);
                addToCart(tags[i].objectId);
            });


            $(tel).on('click', function() {
                var currentDataTel = tags[$(this).data('count')];
                $('#myModalLabel').html(currentDataTel.title);
                $('.modal-body1').html('<img class="modal_foto" src="' + currentDataTel.image + '">');
                $('.modal-body1').append('<p>' + currentDataTel.fullDescription + '</p>');
            });

        }
        $(function() {
            var curUser = "";
            console.log(curUser);
            curUser = Backendless.UserService.getCurrentUser();
            if (curUser != null) {
                $('.addtocart').show();
            }
            else {
                $('.addtocart').hide();
            }
        });
    }

    function findTag(obj) {
        var callback = new Backendless.Async(handleResponseTag, handleFault);
        obj = obj || new Object();
        obj.startPrice = obj.startPrice || parseInt("0");
        obj.endPrice = obj.endPrice || 2000;
        obj.sortBy = obj.sortBy || 'price';
        obj.order = obj.order || "asc";
        obj.pageSize = obj.pageSize || 20;
        obj.categoryId = "categoryId.objectId";
        obj.titleItems = obj.titleItems || "";
        obj.name = "vendorId.name";
        obj.nameItems = obj.nameItems || "";

        var arrayOfTitleItems = "";
        var arrayOfNameItems = "";
        if (obj.titleItems != "") {
            arrayOfTitleItems = createStringOfSearch(obj.titleItems, obj.categoryId);
        }
        if (obj.nameItems != "") {
            arrayOfNameItems = createStringOfSearch(obj.nameItems, obj.name);
        }
        var condition1 = "price >= " + obj.startPrice + " and price <= " + obj.endPrice + " " + arrayOfTitleItems + "" + arrayOfNameItems + "";

        var itemsStorage = Backendless.Persistence.of('items');
        var dataQuery = {
            options: {
                sortBy: (obj.sortBy + " " + obj.order),
                pageSize: obj.pageSize
            },
            condition: condition1
        };
        itemsStorage.find(dataQuery, callback);
    }

    function createStringOfSearch(arr, items) {
        var str = " and (" + items + "='" + arr[0] + "'";
        if (arr.length > 1) {
            for (var i = 0; i < arr.length - 1; i++) {
                str += " or " + items + "='" + arr[i + 1] + "'";
            }

        }
        str += ")";
        return str;
    }

    function handleResponseCategory(cat) {
        var category = cat.data;
        $('#menu-category li').remove();
        $('#menu-category').append('<li class="btn btn-primary  btn-block btn-lg"><p>Все категории <i class="fa fa-mobile" aria-hidden="true"></i></p></li>');
        $.each(category, function(i) {
            $('#menu-category').append('<li class="btn btn-primary  btn-block btn-lg" data-category_id ="' + category[i].objectId + '"><p>' + category[i].name + '</p></li>');
        });

        $("#menu-category li").on("click", function() {
            objItems.nameItems = "";
            var $th = $(this);
            var currentCategory = ($(this).text());
            currentCategoryId = $th.attr("data-category_id");
            objItems.titleItems = [currentCategoryId];
            findTag(objItems);
            findVendors();
        });
    }

    function handleFault(backendlessFault) {
        console.log("Server reported an error - ");
        console.log(backendlessFault.message);
        console.log(backendlessFault.statusCode);
    }

    function findCategory() {
        var callback = new Backendless.Async(handleResponseCategory, handleFault);
        var itemsStorage = Backendless.Persistence.of('category');
        var dataQuery = {};
        itemsStorage.find(dataQuery, callback);
    }

    return {
        init: function(obj, callback) {
            var categoryId;
            var price;
            console.log("Инициализируем модуль главной страницы");
            obj = obj || new Object(null);
            callback = callback || function() {
                return false;
            }
            var $search = obj.find('.form-control');
            obj.find("#search-button").on("click", function() {
                objSearch.title = $search.val();
                seachItems(objSearch);
            });

            $search.on('keydown', function(event) {
                if (event.keyCode == 13) {
                    objSearch.title = $search.val();
                    seachItems(objSearch);
                }
            });


            obj.find("#slider-range").slider({
                range: true,
                min: 0,
                max: 2000,
                values: [0, 2000],
                slide: function(event, ui) {
                    $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
                },
                change: function(e, ui) {
                    objItems.startPrice = ui.values[0];
                    objItems.endPrice = ui.values[1];
                    findTag(objItems);
                }
            });

            obj.find("#amount").val("$" + obj.find("#slider-range").slider("values", 0) +
                " - $" + obj.find("#slider-range").slider("values", 1));

            findCategory();




            callback();
        }
    }
})(jQuery);