$(function() {

    var characterCount = 0;

    $.getJSON(
        "http://lmu-diabolical.appspot.com/characters",
        function (characters) {
            $("tbody").append(characters.map(function (character) {
                characterCount++;
                var tr = $(".character-template").clone();
                tr.find(".name").text(character.name);
                tr.find(".class").text(character.classType);
                tr.find(".gender").text(character.gender);
                tr.find(".level").text(character.level);
                tr.data('info',{
                    'id':character.id,
                    'name': character.name,
                    'money': character.money,
                    'gender': character.gender,
                    'level': character.level,
                    'class': character.classType
                });
                return tr;
            }));
        }
    );

    $('.edit-btn').click(function(){
        $("#edit-name-input").val( $(".active-character-row").data('info')['name'] );
        $("#edit-class-input").val( $(".active-character-row").data('info')['class'] );
        $("#edit-gender-input").val( $(".active-character-row").data('info')['gender']);        
        $("#edit-level-input").val( $(".active-character-row").data('info')['level'] );
        $("#edit-money-input").val( $(".active-character-row").data('info')['money'] );        
    });

    $('table').on('click', 'tr' , function (event) {
        $('.trash-btn').removeClass('disabled');
        $('.edit-btn').removeClass('disabled');
        $('.character-card').addClass('rtable');
        $('.character-card').removeClass('inactive-rtable');
        $('.active-character-row').removeClass('active-character-row'); 
        $(this).addClass('active-character-row');
        fillCharCard($(this).data('info'));                
    });

    $('#delete-char-btn').click( function(){
        characterCount = characterCount > 1 ? characterCount - 1 : 0;
        var rowToRemove = $(".active-character-row");
        deleteChar(rowToRemove.data('info')['id']);
        var nextActiveRow = rowToRemove.closest('tr').next();
        nextActiveRow.addClass('active-character-row');
        rowToRemove.removeClass('active-character-row').remove();
        var info = nextActiveRow.data('info');
        if( $('#char-table >tbody >tr').length === 0 || $('.active-character-row').length === 0 ){
            $('.character-card').remove('rtable');            
            $('.character-card').addClass('inactive-rtable');            
            $('.trash-btn').addClass('disabled');
            $('.edit-btn').addClass('disabled');            
            info = {
                'name':'',
                'level':'',
                'gender':'',
                'class':'',
                'money':''
            };           
        }
        fillCharCard(info);
    });

    var fillCharCard = function( charInfo ){
        $(".character-card").find('.name').text(charInfo['name']);
        $(".character-card").find('.level').text(charInfo['level']);        
        $(".character-card").find('.gender').text(charInfo['gender']);        
        $(".character-card").find('.class').text(charInfo['class']);        
        $(".character-card").find('.money').text(charInfo['money']);         
    };

    var deleteChar = function( charId ){
        $.ajax({
            type: 'DELETE',
            url: "http://lmu-diabolical.appspot.com/characters/" + charId,
            success: function (data, textStatus, jqXHR) {
                console.log("Gone baby gone.");
            }
        });
    };

    $(".edit-text-input-form").blur( function(){
        $("#edit-save-char-btn").removeClass('disabled');        
        $(".edit-text-input-form").each( function(){
            if($(this).val().localeCompare("") === 0 ){ $("#edit-save-char-btn").addClass("disabled");}
        });
    });

    $(".edit-number-input-form").blur(function(){
        $(this).val( +$(this).val() || 0);
    });

    var updateCharRow = function(){
        var tr = $(".active-character-row");
        tr.find(".name").text($(".active-character-row").data('info')['name']);
        tr.find(".class").text($(".active-character-row").data('info')['class']);
        tr.find(".gender").text($(".active-character-row").data('info')['gender']);
        tr.find(".level").text($(".active-character-row").data('info')['level']);
    };

    var updateCharData = function(){
        $(".active-character-row").data('info')['name'] = $("#edit-name-input").val();
        $(".active-character-row").data('info')['money'] = $("#edit-money-input").val();
        $(".active-character-row").data('info')['gender'] = $("#edit-gender-input option:selected").text();
        $(".active-character-row").data('info')['level'] = $("#edit-level-input").val();
        $(".active-character-row").data('info')['class'] = $("#edit-class-input").val();
    };

    $("#edit-save-char-btn").click(function(){
        var charId = $(".active-character-row").data('info')['id'];
        updateCharData();
        $.ajax({
            type: 'PUT',
            url: "http://lmu-diabolical.appspot.com/characters/"+charId,
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
                console.log("Done: no news is good news.");
            }
        });
        fillCharCard($(".active-character-row").data('info'));
        updateCharRow();
        $("#edit-name-input").val("");
        $("#edit-class-input").val("");
        $("#edit-level-input").val(0);
        $("#edit-money-input").val(0);
    });

});
