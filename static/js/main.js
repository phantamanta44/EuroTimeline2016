$(document).ready(function() {
    
    $('.ec-button').click(function() {
        setTimeout(function() {
            $('.ec-button').each(function (i, element) {
                var obj = $(element);
                if (obj.parent().attr('aria-expanded') === 'true') {
                    obj.removeClass('mdi-plus');
                    obj.addClass('mdi-minus');
                } else {
                    obj.removeClass('mdi-minus');
                    obj.addClass('mdi-plus');
                }
            });
        }, 1);
    });
    
})