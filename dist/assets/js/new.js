app.currentModule = (function($) {
    var objItems = {};
    var currentCategoryId = "";

    $(document).ready(function() {
        findTag(objItems);
        findVendors(objItems);
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
        $("#amount").val("$" + obj.find("#slider-range").slider("values", 0) +
            " - $" + $.find("#slider-range").slider("values", 1));

    });


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




    function initPaginator(count) {
        var $pag = $('.pagination');
        $pag.find("li").remove();
        $pag.append('<li class="disabled"><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>');
        for (var i = 1; i <= count; i++) {
            $pag.append('<li class="active"><a href="#">' + i + '<span class="sr-only">(current)</span></a></li>');
            //   li.onclick = myfun(i);
        }

        /*myfun(var i)
        {
            
            var mobieles = 
        }*/
        // $pag.append('<li class="active"><a href="#">1 <span class="sr-only">(current)</span></a></li>');

    }



    function handleResponseTag(tag) {
        var count = tag.totalObjects / 3;
        initPaginator(count);
        var tags = tag.data;
        $('.box_for_tel').html('');
        for (var i = 0; i < tags.length; i++) {
            $('.box_for_tel').append('<div class="tel col-sm-4 col-md-3" data-count="' + i + '">');
            var tel = $('.tel')[i];
            $(tel).append('<div class=" tel_thumbnail thumbnail" data-toggle="modal" data-target="#myModal">');
            var tel_thumbnail = $('.tel_thumbnail')[i];
            $(tel_thumbnail).append("<img class='foto' src='" + tags[i].image + "'>");
            $(tel_thumbnail).append('<h3>' + tags[i].title + '</h3>');
            $(tel_thumbnail).append('<h3>' + tags[i].price + ' $</h3>');

            $(tel).on('click', function() {
                var currentDataTel = tags[$(this).data('count')];
                $('#myModalLabel').html(currentDataTel.title);
                $('.modal-body').html('<img class="modal_foto" src="' + currentDataTel.image + '">');
                $('.modal-body').append('<p>' + currentDataTel.fullDescription + '</p>');
            });


        }
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
            //properties: ["name", "objectId"],
            options: {
                sortBy: (obj.sortBy + " " + obj.order),
                pageSize: obj.pageSize
            },
            condition: condition1
        };
        var myContact = itemsStorage.find(dataQuery, callback);
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
        $('#menu-category').append('<li><a href="#/">Все категории</a></li>');
        $.each(category, function(i) {
            $('#menu-category').append('<li data-category_id ="' + category[i].objectId + '"><a href="#/">' + category[i].name + '</a></li>');
        });

        $("#menu-category li").on("click", function() {
            objItems.nameItems = "";
            var $th = $(this);
            currentCategory = ($(this).text());
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

            findTag(objItems);
            findCategory();

            obj.find('#test-btn').on("click", function() {
                findTag(objItems);
                findCategory();
            });

            callback();
        }
    }
})(jQuery);