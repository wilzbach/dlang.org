/**
Generates 'Jump to' links.

Copyright: 1999-2016 by Digital Mars

License:   http://boost.org/LICENSE_1_0.txt, Boost License 1.0

Authors:   Andrei Alexandrescu, Nick Treleaven
*/

function lastName(a) {
    var pos = a.lastIndexOf('.');
    return a.slice(pos + 1);
}

function createClipboard(a, symbolName)
{
    // copy-to-clipboard
    var el = document.createElement("i");
    // name start with .
    var symbol = a.name.split(".")[1];
    var text = "import " + document.body.id + " : " + symbol + ";";
    el.setAttribute("data-clipboard-text", text);
    el.setAttribute("aria-hidden", true);
    el.className = "fa fa-clipboard";

    var container =  document.createElement("span");
    container.className = "tip smallprint decl_relement";
    container.setAttribute("width", "auto");
    var tooltip = document.createElement("div");

    var copyToText = "Copy to clipboard";
    tooltip.textContent = copyToText;

    // instantiate clipboard
    var clipboard = new Clipboard(el);
    clipboard.on('success', function(e){
        tooltip.textContent = "Copied!";
        $(container).one('mouseleave',function(e){
            tooltip.textContent = copyToText;
        });
    });

    container.appendChild(el);
    container.appendChild(tooltip);
    return container;
}

// adds a anchor link to every documented declaration
function addAnchors()
{
    var items = document.getElementsByClassName('d_decl');
    if(!items) return;
    for (var i = 0; i < items.length; i++)
    {
        // we link to the first children
        var a = items[i].querySelector('a');
        if(!a) continue;

        items[i].insertBefore(createClipboard(a), items[i].firstChild);

        // create anchor
        var permLink = document.createElement("a");
        permLink.setAttribute('href', '#' + a.name);
        permLink.className = "fa fa-anchor decl_relement";
        items[i].insertBefore(permLink, items[i].firstChild);
    }
}

function listAnchors()
{
    var hideTop = (typeof inhibitQuickIndex !== 'undefined');
    var a = document.getElementById("quickindex");
    if (!a) return;

    // build hash of parent anchor names -> array of child anchor names
    var parentNames = [];
    var lastAnchor = '';
    var items = document.getElementsByClassName('quickindex');
    for (var i = 0; i < items.length; i++)
    {
        var text = items[i].id;
        // ignore top-level quickindex
        var pos = text.indexOf('.');
        if (pos < 0) continue;
        // skip 'quickindex'
        text = text.slice(pos);
        // ignore any ditto overloads (which have the same anchor name)
        if (text == lastAnchor) continue;
        lastAnchor = text;
        
        var pos = text.lastIndexOf('.');
        if (hideTop && pos == 0) continue;
        var parent = (pos == 0) ? '' : text.slice(0, pos);
        
        if (!parentNames[parent])
            parentNames[parent] = [text];
        else
            parentNames[parent].push(text);
    }
    // populate quickindex elements
    for (var key in parentNames)
    {
        var arr = parentNames[key];
        // we won't display the qualifying names to save space, so sort by last name
        arr.sort(function(a,b){
            var aa = lastName(a).toLowerCase();
            var bb = lastName(b).toLowerCase();
            return aa == bb ? 0 : (aa < bb ? -1 : 1);
        });
        var newText = "";
        for (var i = 0; i < arr.length; i++) {
            var a = arr[i];
            var text = lastName(a);
            if (i != 0) newText += " &middot;"; 
            newText += ' <a href="#' + a +
                '">' + text + '</a>';
        }
        if (newText != "")
        {
            newText = '<p><b>Jump to:</b><span class="jumpto notranslate donthyphenate">' +
                newText + '</span></p>';
        }
        var id = 'quickindex';
        id += key;
        var e = document.getElementById(id);
        e.innerHTML = newText;
    }
}

jQuery(document).ready(function(){
    listAnchors();
    addAnchors();
});
