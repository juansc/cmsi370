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
                tr.data('id',character.id)
                return tr;
            }));
        }
    );
});


$(function(){
    $('table').on('click', 'tr' , function (event) {
        $('.active-character-row').removeClass('active-character-row'); 
        $(this).addClass('active-character-row'); 
    });
});
