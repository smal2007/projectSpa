app.currentModule = (function($) {
    var curUser = "";



    $(document).ready(function() {
        $(".nav-tabs a").click(function() {
            $(this).tab('show');
        });

    });

    $(window).on('hashchange', function() {
        $("#refresh-table").on("click", function() {
            console.log("Refreshed");
            viewItems(findCart());
        });
    });

    $(".nav-tabs").change(function() {
        $("#refresh-table").on("click", function() {
            console.log("Refreshed");
            viewItems(findCart());
        });
    });

    $(function() {
        $('#myTab a:last').tab('show');
    });


    function findItems(id) {
        var arrayOfItems = {};
        var dataQuery = {
            options: {
                // pageSize: obj.pageSize
            },
            condition: "objectId = '" + id + "'"
        };
        //  var myContact = Backendless.Persistence.of('items').find(dataQuery, new Backendless.Async(userLoggedIn(myContact), gotError));
        var myContact = Backendless.Persistence.of('items').find(dataQuery);
        $.each(myContact.data, function(i) {
            arrayOfItems[arrayOfItems.length] = myContact.data[i];
        });
        return myContact;
    }

    function findCart() {
        var arrayOfItems = [];
        var dataQuery = {
            options: {},
            // condition: "itemId = cart.itemId"
        };

        var myContact = Backendless.Persistence.of('cart').find(dataQuery);
        $.each(myContact.data, function(i) {
            arrayOfItems[arrayOfItems.length] = myContact.data[i];
        });
        console.log()
        return arrayOfItems;
    };


    function viewItems(data) {
        $(".table thead td").remove();
        var sum = 0;
        $.each(data, function(i) {
            console.log(data);
            var items = findItems(data[i].itemId);
            // console.log(items);
            sum += items.data[0].price * data[i].count;
            $(".table thead").append("<tr><td>" + data[i].objectId + "</td><td>" + items.data[0].title + "</td><td>" + items.data[0].price + "</td><td><input class='count-input' type='text' value=" + data[i].count + "></td><td class='next-input total-count'>" + items.data[0].price * data[i].count + "</td></tr>");
        });
        $("#total-cart-summa").text(sum);

        $(".count-input").keyup(function() {
            var next = $(this).closest('td').next('td');
            var prev = $(this).closest('td').prev('td');
            var cur = $(this);
            next.text(parseInt(prev.text()) * cur.val());
            console.log();
            var count = 0;

            $(".total-count").each(function() {
                count += parseInt($(this).text());
            });

            $("#total-cart-summa").text(count);
        });

        $('.count-input').on('keydown', function(event) {
            if (event.keyCode == 13) {
                saveInTable($(this).parent().parent().children(':first-child').text(), $(this).val())
            }
        });
    }

    function saveInTable(objectId, count) {
        var dataStore = Backendless.Persistence.of('cart');
        var commentObject = new Cart({
            count: count,
            objectId: objectId
        });
        dataStore.save(commentObject);

        function Cart(args) {
            args = args || {};
            this.count = args.count || "";
            this.objectId = args.objectId || "";
        }
    }

    function handleResponseHistory(hist) {
        var dataPhones = hist.data;
        console.log(dataPhones);
        $('.box_for_tel1 div').remove();
        for (var i = 0; i < dataPhones.length; i++) {
            $('.box_for_tel1').append('<div class="tel col-sm-4 col-md-3" data-count="' + i + '">');
            var tel = $('.tel')[i];
            $(tel).append('<div class=" tel_thumbnail thumbnail">');
            var tel_thumbnail = $('.tel_thumbnail')[i];
            $(tel_thumbnail).append("<img class='foto' data-toggle='modal' data-target='#myModal' src='" + dataPhones[i].image + "'>");
            $(tel_thumbnail).append('<h3>' + dataPhones[i].title + '</h3>');
            $(tel_thumbnail).append('<h3>' + dataPhones[i].price + ' $</h3>');

            $(tel).on('click', function() {
                var currentDataTel = dataPhones[$(this).data('count')];
                $('#myModalLabel').html(currentDataTel.title);
                $('.modal-body').html('<img class="modal_foto" src="' + currentDataTel.image + '">');
                $('.modal-body').append('<p>' + currentDataTel.fullDescription + '</p>');
            });
        }
    }

    function handleFault(backendlessFault) {
        console.log("Server reported an error - ");
        console.log(backendlessFault.message);
        console.log(backendlessFault.statusCode);
    }

    function findHistory(obj) {
        var callback = new Backendless.Async(handleResponseHistory, handleFault);
        obj = obj || new Object();
        obj.pageSize = obj.pageSize || 20;
        obj.objectId = obj.objectId || "";
        console.log(obj.objectId);
        obj.nameItems = "objectId";

        var arrayOfTitleItems = "";
        if (obj.nameItems != "") {
            arrayOfTitleItems = createStringOfSearch(obj.objectId, obj.nameItems);
        }

        var condition1 = arrayOfTitleItems;
        console.log(condition1);

        var itemsStorage = Backendless.Persistence.of('items');
        var dataQuery = {
            //properties: ["name", "objectId"],
            options: {
                pageSize: obj.pageSize
            },
            condition: condition1
        };
        itemsStorage.find(dataQuery, callback);
    }

    function createStringOfSearch(arr, items) {
        var str = "(" + items + "='" + arr[0] + "'";
        if (arr.length > 1) {
            for (var i = 0; i < arr.length - 1; i++) {
                str += " or " + items + "='" + arr[i + 1] + "'";
            }

        }
        str += ")";
        return str;
    }

    return {
        init: function(obj, callback) {
            console.log("Инициализируем модуль для главной страницы");
            obj = obj || new Object(null);
            callback = callback || function() {
                return false;
            }

            obj.find("#refresh-table").on('click', function() {
                console.log("Refreshed");
                viewItems(findCart());
            });

            obj.find('#refresh-table1').on("click", function() {
                $('.box_for_tel1 div').remove();
            });

            callback();

        },

    }
})(jQuery);

/*$('input[type=text]').each(function() {
    objData[$(this).attr('name')] = $(this).val()
})*/