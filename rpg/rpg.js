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
        $("#save-char-btn").removeClass('disabled');        
        $(".edit-text-input-form").each( function(){
            if($(this).val().localeCompare("") === 0 ){ $("#save-char-btn").addClass("disabled");}
        });
    });

    $(".edit-number-input-form").blur(function(){
        $(this).val( +$(this).val() || 0);
    });
});
