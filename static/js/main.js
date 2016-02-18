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
                        ppppDiv.css('z-index', 8000);
                    } else {
                        obj.removeClass('mdi-minus');
                        obj.addClass('mdi-plus');
                        ppppDiv.css('z-index', ppppDiv.attr('data-zind'));
                    }
                });
            }, 1);
        });
        $('.strand-event').hover(function() {
            $('.strand-event').each(function(i, element) {
                var obj = $(element);
                if (obj.has('.tooltip'))
                    obj.css('z-index', 8001);
                else
                    obj.css('z-index', obj.attr('data-zind'));
            });
        });
    };
    
    var inBounds = function(n, lower, upper) {
        return n > lower && n < upper;
    };
    
    var gYearS, gYearL, gYearE;
    
    var themes;
    
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
        
        var yearHeight = $('#strand-' + strand).height() / gYearL;
        var yVal = yearHeight * (y1 - gYearS);
        $.each(events[strand], function(i, oe) {
            var eh = oe.innerHeight();
            var oy = oe.position().top;
            if (inBounds(yVal, oy, oy + 65))
                yVal = oy + 65;
        });
        
        event.css('top', yVal + 'px');
        event.css('z-index', 4000 - id);
        event.attr('data-zind', 4000 - id);
        event.addClass('event-theme-' + themeId);
        events[strand].push(event);
        
        return event;
    };
    
    var procStrand = function(sName, eList) {
        var sDiv = $('#strand-' + sName);
        eList.sort(function(a, b) {
            return a.sYear - b.sYear;
        });
        $.each(eList, function(i, obj) {
            sDiv.append(genEvent(sName, obj.name, obj.sYear, obj.eYear, obj.desc, obj.theme));
        });
    };
    
    var procEvents = function(data, status, req) {
        document.title = data.name;
        var tlTitle = $('#timeline-title');
        tlTitle.text(data.name + ' ');
        var tlSubtitle = $('<small>');
        tlSubtitle.text(data.subtitle);
        tlTitle.append(tlSubtitle);
        gYearS = data.startYear;
        gYearL = data.endYear - data.startYear;
        gYearE = data.endYear;
        themes = data.themes;
        procStrand('pol', data.strands.pol);
        procStrand('econ', data.strands.econ);
        procStrand('cult', data.strands.cult);
        setupCollapse();
    };
    
    if (!document.location.search)
        $.getJSON('static/json/events.json').done(procEvents);
    else
        $.getJSON(document.location.search.substring(1)).done(procEvents);
    
});