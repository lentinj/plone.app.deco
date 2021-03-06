// Create executed property
$.deco.executed = [];

// Create initActions stub function
$.deco.initActions = function () {
    $.deco.executed.push("initActions");
};

// Create initNotify stub function
$.deco.initNotify = function () {
    $.deco.executed.push("initNotify");
};

// Create undo stub class
$.deco.undo = {
    init : function () {
        $.deco.executed.push("undo.init");
    }
}

// Create initUpload stub function
$.deco.initUpload = function () {
    $.deco.executed.push("initUpload");
};

// Create decoToolbar stub function
$.fn.decoToolbar = function() {
    $.deco.executed.push("decoToolbar");
};

// Create decoLayout stub function
$.fn.decoLayout = function() {
    $.deco.executed.push("decoLayout");
};

// Create ajax stub function
$.ajax = function (options) {
    options.success({test: 1});
};

module("core", {
    setup: function () {
        // We'll create a div element for the overlay
        $(document.body)
            .append(
                $(document.createElement("div"))
                    .attr("id", "content")
            );
        $(document.body)
            .append(
                $(document.createElement("div"))
                    .attr("id", "portal-column-one")
            );
        $(document.body)
            .append($(document.createElement("textarea"))
                .attr('id', 'form-widgets-ILayoutAware-content')
                .val('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><head><link rel="layout" href="./@@test-layout" /><link rel="panel" rev="content" target="content" /><link rel="panel" rev="portal-column-one" target="portal-column-one" /></head><body><div class="deco-panel" id="content">content text</div><div class="deco-panel" id="portal-column-one">portal-column-one text</div></body></html>')
            );

        // Empty executed
        $.deco.executed = [];
    },
    teardown: function () {
        $("#content").remove();
        $("#content-edit").remove();
        $("#portal-column-one").remove();
        $(".deco-toolbar").remove();
        $("#form-widgets-ILayoutAware-content").remove();
        $("#content-views").remove();
        $(".contentActions").remove();
        $("#edit-bar").remove();
        $(".deco-blur").removeClass("deco-blur");
    }
});

test("Initialisation", function() {
    expect(1);

    ok($.deco, "$.deco");
});

test("Init without data", function() {
    expect(3);

    // Empty data
    $("#form-widgets-ILayoutAware-content").val('');

    $.deco.init({url: 'http://nohost/test/edit'});
    equals($("#content").html(), "", 'Region content is still empty');
    equals($("#portal-column-one").html(), "", 'Portal column one is still empty');
    equals($.deco.executed.indexOf("initActions") != -1, true, 'Init actions is called');
});

test("Init with data", function() {
    expect(12);

    $.deco.init({url: 'http://nohost/test/edit'});

    equals($("#content").html(), "content text", 'Region content is populated');
    equals($("#portal-column-one").html(), "portal-column-one text", 'Portal column one is populated');

    equals($("#content").hasClass('deco-panel'), true, 'Region content has deco-panel class');
    equals($("#portal-column-one").hasClass('deco-panel'), true, 'Portal column one has deco-panel class');

    equals($.deco.options.test, 1, 'Options are stored');
    equals($.deco.options.url, 'http://nohost/test', 'Url is stripped of /edit');

    equals($(".deco-toolbar").length, 1, 'Toolbar div is added');

    equals($.deco.options.panels.length, 2, "Two panels are stored on the options");
    equals($.deco.options.toolbar.length, 1, "Toolbar is stored on the options");

    equals($.deco.executed.indexOf("decoToolbar") != -1, true, "Toolbar init is called");

    equals($(".deco-panel").hasClass('deco-blur'), false, "Panels are not blurred");
    equals($(".deco-toolbar").hasClass('deco-blur'), false, "Toolbar is not blurred");
});

test("Init with data add url", function() {
    expect(0);

    // Set layout content
    $("#form-widgets-ILayoutAware-content").val('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><head><link rel="layout" href="./@@test-layout" /><link rel="panel" rev="content" target="content" /><link rel="panel" rev="portal-column-one" target="portal-column-one" />    <link  rel="tile" target="tile-title" href="./@@plone.app.standardtiles.field?field=title" /></head><body><div class="deco-panel" id="content">content text</div><div class="deco-panel" id="portal-column-one"><div class="deco-tile deco-plone.app.standardtiles.title-tile"><div class="deco-tile-content"> <div id="tile-title"></div> </div> </div> </div></body></html>')

    // Init with add url
    // $.deco.init({url: 'http://nohost/test/++add++page'});

    // equals($("#content").html(), "content text", 'Region content is populated');
    // equals($('#portal-column-one').html().indexOf("tileUrl") != -1, true, 'App tile is loaded');
});

test("Add/remove head tags", function() {
    expect(2);

    // Add head tag
    $.deco.addHeadTags('http://nohost/test/@@plone.app.standardtiles.pony/tile-1', $.deco.getDomTreeFromHtml('<html><head><link href="test.css" media="screen" type="text/css" rel="stylesheet"/></head></html>'));
    equals($("head link[href=test.css]").length, 1, 'Stylesheet is added to the head');

    // Remove head tag
    $.deco.removeHeadTags('http://nohost/test/@@plone.app.standardtiles.pony/tile-1');
    equals($("head link[href=test.css]").length, 0, 'Stylesheet is removed from the head');
});
