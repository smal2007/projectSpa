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
            var items = findItems(data[i].itemId);
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
                count += parseInt(this).text();
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

            callback();

        },

    }
})(jQuery);

/*$('input[type=text]').each(function() {
    objData[$(this).attr('name')] = $(this).val()
})*/