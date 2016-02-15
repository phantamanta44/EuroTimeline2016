$(document).ready(function() {
    
    var setupCollapse = function() {
        $('.ec-button').click(function() {
            setTimeout(function() {
                $('.ec-button').each(function(i, element) {
                    var obj = $(element);
                    var ppppDiv = obj.parent().parent().parent().parent();
                    if (obj.parent().attr('aria-expanded') === 'true') {
                        obj.removeClass('mdi-plus');
                        obj.addClass('mdi-minus');
                        ppppDiv.css('z-index', '1984');
                    } else {
                        obj.removeClass('mdi-minus');
                        obj.addClass('mdi-plus');
                        ppppDiv.css('z-index', ppppDiv.attr('data-zind'));
                    }
                });
            }, 1);
        });
    };
    
    var inBounds = function(n, lower, upper) {
        return n > lower && n < upper;
    };
    
    var themes = [
        {name: 'Religious Reformation', icon: 'mdi-church'},
        {name: 'Government Centralization', icon: 'mdi-bank'}   
    ];
    
    var events = {
        pol: [],
        econ: [],
        cult: []
    };
    var eventId = 0;
    
    var genEvent = function(strand, name, y1, y2, desc, themeId) {
        var event = $('<div>', {class: 'strand-event panel'});
        var theme = themes[themeId];
        var id = eventId++;
        
        // Event Heading
        
        var heading = $('<div>', {class: 'panel-heading row center-box'});
        
        var themeDiv = $('<div>', {class: 'col-xs-1 center-box'});
        var themeIcon = $('<i>', {
            class: 'mdi theme-icon',
            'data-placement': 'bottom',
            'data-toggle': 'tooltip',
            title: theme.name
        });
        themeIcon.addClass(theme.icon);
        themeIcon.tooltip();
        themeDiv.append(themeIcon);
        heading.append(themeDiv);
        
        var nameDiv = $('<div>', {class: 'col-xs-9'});
        var nameH = $('<h4>');
        var eTitle = $('<strong>');
        var eSubtitle = $('<small>');
        eTitle.text(name + ' ');
        eSubtitle.html(y1 + (y2 ? '&ndash;' + y2 : ''));
        nameH.append(eTitle);
        nameH.append(eSubtitle);
        nameDiv.append(nameH);
        heading.append(nameDiv);
        
        var collapseBtnDiv = $('<div>', {class: 'col-xs-2 text-left'});
        var collapseLink = $('<a>', {
            'data-toggle': 'collapse',
            'data-parent': '#strand-' + strand,
            'href': '#panel-event-' + id
        });
        var collapseIcon = $('<i>', {class: 'mdi mdi-plus ec-button'});
        collapseLink.append(collapseIcon);
        collapseBtnDiv.append(collapseLink);
        heading.append(collapseBtnDiv);
        
        // Event Body
        
        var bodyWrapper = $('<div>', {class: 'panel-collapse collapse', id: 'panel-event-' + id});
        var body = $('<div>', {class: 'panel-body'});
        var bodyDescP = $('<p>', {class: 'event-desc'});
        bodyDescP.text(desc);
        body.append(bodyDescP);
        bodyWrapper.append(body);
        
        event.append(heading);
        event.append(bodyWrapper);
        
        var yearHeight = $('#strand-' + strand).height() / 400;
        var yVal = yearHeight * (y1 - 1500);
        $.each(events[strand], function(i, oe) {
            var eh = oe.innerHeight();
            var oy = oe.position().top;
            if (inBounds(yVal, oy, oy + 65))
                yVal = oy + 65;
        });
        
        event.css('top', yVal + 'px');
        event.css('z-index', 1517 - id);
        event.attr('data-zind', 1517 - id);
        events[strand].push(event);
        
        return event;
    };
    
    var procStrand = function(sName, eList) {
        var sDiv = $('#strand-' + sName);
        $.each(eList, function(i, obj) {
            sDiv.append(genEvent(sName, obj.name, obj.sYear, obj.eYear, obj.desc, obj.theme));
        });
    };
    
    var procEvents = function(data, status, req) {
        procStrand('pol', data.pol);
        procStrand('econ', data.econ);
        procStrand('cult', data.cult);
        setupCollapse();
    };
    
    $.getJSON('static/json/events.json').done(procEvents);
    
});