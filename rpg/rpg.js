$(function() {
    $.getJSON(
        "http://lmu-diabolical.appspot.com/characters",
        function (characters) {
            $("tbody").append(characters.map(function (character) {
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
});


$(function(){
    $('table').on('click', 'tr' , function (event) {
        $('.character-card').addClass('rtable');
        $('.character-card').removeClass('inactive-rtable');
        $('.active-character-row').removeClass('active-character-row'); 
        $(this).addClass('active-character-row');
        var charInfo = $(this).data('info');
        $(".character-card").find('.name').text(charInfo['name']);
        $(".character-card").find('.level').text(charInfo['level']);        
        $(".character-card").find('.gender').text(charInfo['gender']);        
        $(".character-card").find('.class').text(charInfo['class']);        
        $(".character-card").find('.money').text(charInfo['money']); 
                       
    });
});
