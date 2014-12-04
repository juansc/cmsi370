$(function () {

    $.getJSON(
        "http://lmu-diabolical.appspot.com/characters",

    function (characters) {
        $("tbody").append(characters.map(function (character) {
            var tr = $(".character-template").clone();
            // JD: 10
            tr.find(".name").text(character.name);
            tr.find(".class").text(character.classType);
            tr.find(".gender").text(character.gender);
            tr.find(".level").text(character.level);
            tr.data('info', { // JD: 11
                'id': character.id,
                    'name': character.name,
                    'money': character.money,
                    'gender': character.gender,
                    'level': character.level,
                    'class': character.classType
            });
            tr.removeClass("character-template");
            return tr;
        }));
        $(".ajax-feedback").addClass("hidden");
    });

    var activateModifiers = function () { // JD: 5
        $('.trash-btn,.edit-btn,#item-btn').removeClass('disabled');
        $('.character-card').removeClass('inactive-rtable');
    };

    var cleanUpAfterNewChar = function () {
        $(".add-btn").removeClass("disabled");
        $("#create-name-input").val("");
        $("#create-class-input").val("");
        $("#create-level-input").val(0);
        $("#create-money-input").val(0);
        $("#create-save-char-btn").addClass("disabled");
        $(".ajax-feedback").addClass("hidden");
        $("tbody").scrollTop('0');
    };

    $('.edit-btn').click(function () {
        // JD: 10
        // JD: 12 for $(".active-character-row").data('info')
        $("#edit-name-input").val($(".active-character-row").data('info')['name']);
        $("#edit-class-input").val($(".active-character-row").data('info')['class']);
        $("#edit-gender-input").val($(".active-character-row").data('info')['gender']);
        $("#edit-level-input").val($(".active-character-row").data('info')['level']);
        $("#edit-money-input").val($(".active-character-row").data('info')['money']);
    });

    $('table').on('click', 'tr', function (event) {
        activateModifiers();
        $('.active-character-row').removeClass('active-character-row');
        $(this).addClass('active-character-row');
        fillCharCard($(this).data('info'));
    });

    $('#delete-char-btn').click(function () { // JD: 5
        var rowToRemove = $(".active-character-row");
        deleteChar(rowToRemove.data('info')['id']);
        // JD: 15---this code should happen only when deleteChar Ajax call returns.
        var nextActiveRow = rowToRemove.closest('tr').next();
        nextActiveRow.addClass('active-character-row');
        rowToRemove.removeClass('active-character-row').remove();
        var info = nextActiveRow.data('info');
        // JD: 13, 5; see below for suggested revision (includng spacing)
        if (!$('#char-table > tbody > tr').length || !$('.active-character-row').length) {
            $('.character-card').addClass('inactive-rtable');
            $('.trash-btn,.edit-btn,#item-btn').addClass('disabled');
            info = {
                'name': '',
                    'level': '',
                    'gender': '',
                    'class': '',
                    'money': ''
            };
        }
        fillCharCard(info); // JD: 14
    });

    var fillCharCard = function (charInfo) { // JD: 5
        // JD: 12, 10
        $(".character-card").find('.name').text(charInfo['name']);
        $(".character-card").find('.level').text(charInfo['level']);
        $(".character-card").find('.gender').text(charInfo['gender']);
        $(".character-card").find('.class').text(charInfo['class']);
        $(".character-card").find('.money').text(charInfo['money']);
    };

    var deleteChar = function (charId) { // JD: 5
        $.ajax({
            type: 'DELETE',
            url: "http://lmu-diabolical.appspot.com/characters/" + charId,
            success: function (data, textStatus, jqXHR) {
                // JD: 15 (see above)
                console.log("Gone baby gone.");
            }
        });
    };

    $(".edit-text-input-form").keyup(function () { // JD: 5
        $("#edit-save-char-btn").removeClass('disabled');
        $(".edit-text-input-form").each(function () {
            // JD: 13
            if ($(this).val().localeCompare("") === 0) {
                $("#edit-save-char-btn").addClass("disabled");
            }
        });
    });

    // JD: Oh heck... 5 for most of this file, probably.
    $(".create-text-input-form").keyup(function () {
        $("#create-save-char-btn").removeClass('disabled');
        $(".create-text-input-form").each(function () {
            // JD: 13
            if ($(this).val().localeCompare("") === 0) {
                $("#create-save-char-btn").addClass("disabled");
            }
        });
    });

    $(".number-input-form").blur(function () {
        $(this).val(+$(this).val() || 0);
    });

    var updateCharRow = function () {
        var tr = $(".active-character-row");
        // JD: 17 (compare to fillCharCard)
        tr.find(".name").text($(".active-character-row").data('info')['name']);
        tr.find(".class").text($(".active-character-row").data('info')['class']);
        tr.find(".gender").text($(".active-character-row").data('info')['gender']);
        tr.find(".level").text($(".active-character-row").data('info')['level']);
    };

    var updateCharData = function () {
        // JD: 17 (compare to fillCharCard)
        $(".active-character-row").data('info')['name'] = $("#edit-name-input").val();
        $(".active-character-row").data('info')['money'] = $("#edit-money-input").val();
        $(".active-character-row").data('info')['gender'] = $("#edit-gender-input option:selected").text();
        $(".active-character-row").data('info')['level'] = $("#edit-level-input").val();
        $(".active-character-row").data('info')['class'] = $("#edit-class-input").val();
    };

    $("#edit-save-char-btn").click(function () {
        var charId = $(".active-character-row").data('info')['id'];
        updateCharData();
        $.ajax({
            type: 'PUT',
            url: "http://lmu-diabolical.appspot.com/characters/" + charId,
            data: JSON.stringify({
                id: charId,
                name: $("#edit-name-input").val(),
                classType: $("#edit-class-input").val(),
                gender: $("#edit-gender-input option:selected").text(),
                level: $("#edit-level-input").val(),
                money: $("#edit-money-input").val()
            }),
            contentType: "application/json",
            dataType: "json",
            accept: "application/json",
            success: function (data, textStatus, jqXHR) {
                // JD: 15
                console.log("Done: no news is good news.");
            }
        });

        // JD: 15---should be in the callback.
        fillCharCard($(".active-character-row").data('info'));
        updateCharRow();
        $("#edit-name-input").val("");
        $("#edit-class-input").val("");
        $("#edit-level-input").val(0);
        $("#edit-money-input").val(0);
    });


    var appendCharRow = function (charId) {
        $.getJSON(
        charId,

        function (character) {
            var tr = $(".character-template").clone();
            tr.find(".name").text(character.name);
            tr.find(".class").text(character.classType);
            tr.find(".gender").text(character.gender);
            tr.find(".level").text(character.level);
            tr.data('info', { // JD: 10, 17
                'id': character.id,
                    'name': character.name,
                    'money': character.money,
                    'gender': character.gender,
                    'level': character.level,
                    'class': character.classType
            });
            activateModifiers();
            $('.active-character-row').removeClass('active-character-row');
            tr.addClass("active-character-row")
            tr.removeClass("character-template");
            $("tbody").prepend(tr);
            fillCharCard(tr.data('info'));
        });
        cleanUpAfterNewChar();
    };

    $("#create-save-char-btn").click(function () {
        $(".ajax-feedback").removeClass("hidden");
        $.ajax({
            type: 'POST',
            url: "http://lmu-diabolical.appspot.com/characters",
            data: JSON.stringify({
                name: $("#create-name-input").val(),
                classType: $("#create-class-input").val(),
                gender: $("#create-gender-input option:selected").text(),
                level: $("#create-level-input").val(),
                money: $("#create-money-input").val()
            }),
            contentType: "application/json",
            dataType: "json",
            accept: "application/json",
            complete: function (jqXHR, textStatus) {
                // JD: !15 ...yes, this is how it's done.
                appendCharRow(jqXHR.getResponseHeader("Location"));
            }
        });
        $(".add-btn").addClass("disabled");
    });

    $("#spawn-char-btn").click(function () {
        $(".ajax-feedback").removeClass("hidden");
        $.getJSON(
            "http://lmu-diabolical.appspot.com/characters/spawn",

        function (character) { // JD: 17---virtually identical to appendCharRow!!!
            var tr = $(".character-template").clone();
            tr.find(".name").text(character.name);
            tr.find(".class").text(character.classType);
            tr.find(".gender").text(character.gender);
            tr.find(".level").text(character.level);
            tr.data('info', { // JD: 10, 17
                'id': character.id,
                    'name': character.name,
                    'money': character.money,
                    'gender': character.gender,
                    'level': character.level,
                    'class': character.classType
            });
            activateModifiers();
            $('.active-character-row').removeClass('active-character-row');
            tr.addClass("active-character-row")
            tr.removeClass("character-template");
            $("tbody").prepend(tr);
            fillCharCard(tr.data('info'));
            cleanUpAfterNewChar();
        });
    });

    $("#item-btn").click(function () {
        $.getJSON(
            "http://lmu-diabolical.appspot.com/items/spawn", {
            level: 50,
            slot: "body"
        },

        function (item) {
            console.log(item);
            var weaponsList = [
                "Longsword",
                "Mace",
                "Wand",
                "Greatsword",
                "Dagger",
                "Composite Bow",
                "War Hammer",
                "Gauntlet"];
            var weaponName = weaponsList[Math.floor(Math.random() * weaponsList.length)];
            // JD: 10
            $(".item-description").find('#weapon-name').text(weaponName);
            $(".item-description").find('.level').text(item.level);
            $(".item-description").find('.absorption').text(parseFloat(item.absorption).toFixed(2));
            $(".item-description").find('.atkspeed').text(parseFloat(item.atkspeed).toFixed(2));
            $(".item-description").find('.blockchance').text(parseFloat(item.blockchance).toFixed(2));
            $(".item-description").find('.critchance').text(parseFloat(item.critchance).toFixed(2));
            $(".item-description").find('.defense').text(parseFloat(item.defense).toFixed(2));
            $(".item-description").find('.maxdamage').text(parseFloat(item.maxdamage).toFixed(2));
            $(".item-description").find('.mindamage').text(parseFloat(item.mindamage).toFixed(2));
            $('#itemModal').modal('show');
        });
    });

});