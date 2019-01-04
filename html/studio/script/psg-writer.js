

// Creates an HTML Table manager for editing PSG phrases and sentences
function PhraseTable(id) {

    this.element = document.createElement('TABLE');

    // link-back to this object for scripting access with the properties/prototype of this constructor
    this.element.controller = this;

    if (id) this.element.id = id;

    this.element.className = "phrase-table";

    this.body = this.element.createTBody();
    this.body.className = 'phrase-table-body';

    this.header = this.element.createTHead();
    this.header.className = 'phrase-table-header';
 
    var headerRow = document.createElement('tr');
    this.header.appendChild(headerRow);

    var headerRowCell = document.createElement('th');
    headerRow.appendChild(headerRowCell);
    headerRowCell.innerText = ': POSITION';

    headerRowCell = document.createElement('th');
    headerRow.appendChild(headerRowCell);
    headerRowCell.innerText = ': LODIAL';

    headerRowCell = document.createElement('th');
    headerRow.appendChild(headerRowCell);
    headerRowCell.innerText = ': FACT';

    // row controls cell
    headerRowCell = document.createElement('th');
    headerRow.appendChild(headerRowCell);

    this.footer = this.element.createTFoot();
    this.footer.className = 'phrase-table-footer';
 
    var footerRow = document.createElement('tr');
    this.footer.appendChild(footerRow);

    // for the button functions reference
    var controller = this;

    var footerRowCell = document.createElement('td');
    footerRow.appendChild(footerRowCell);
    footerRowCell.colSpan = 4;

    footerRowCell.appendChild(PhraseTableButtonControl('PhraseTableClearPhrases', 'backspace', 'clear-form', function (event){
        controller.clearPhrases();
    }));
    
    footerRowCell.appendChild(PhraseTableButtonControl('PhraseTableAddPhrase', 'add', 'new-phrase', function(event) {
        controller.addPhrase();
    }));

    footerRowCell.appendChild(PhraseTableButtonControl('PhraseTablePlaceVerb', 'all_inclusive', 'is/are', function (event){
        controller.addVerb();
    }));

    footerRowCell.appendChild(PhraseTableButtonControl('PhraseTableCompileClaimBackwards', 'chevron_left', 'view-claim-backwards', function(event){
        controller.getBackwardSyntax();
    }));

    footerRowCell.appendChild(PhraseTableButtonControl('PhraseTableCompileClaimForwards', 'chevron_right', 'view-claim-forwards', function(event){
        controller.getForwardSyntax();
    }));

    footerRow = document.createElement('tr');
    this.footer.appendChild(footerRow);
    footerRowCell = document.createElement('td');
    footerRowCell.colSpan = 4;
    footerRowCell.className = 'phrase-table-document-view';
    footerRowCell.id = 'documentView';
    footerRow.appendChild(footerRowCell);
    this.documentView = footerRowCell;

    this.addPhrase();

}

PhraseTable.prototype = {

    constructor: PhraseTable,

    clearPhrases: function() {
        this.body.innerHTML = '';
        this.addPhrase();
    },

    addPhrase: function(after) {

        var row, cell, button, control, controller = this;

        row = this.body.insertRow();
        row.controls = [];
        row.controls.push(control = PhraseTablePositionSelector());
        cell = document.createElement('td');
        cell.appendChild(control);
        row.appendChild(cell);
        if (after) {
            after.parentNode.insertBefore(row, after.nextSibling);
        }
        control.focus();

        row.controls.push(control = PhraseTableLodialSelector());
        cell = document.createElement('td');
        cell.appendChild(control);
        row.appendChild(cell);

        row.controls.push(control = PhraseTableFactEditor());
        cell = document.createElement('td');
        cell.appendChild(control);
        row.appendChild(cell);

        control.onkeypress = function(event) {
            if (event.keyCode == 13 || event.which == 13){
                if (event.shiftKey) controller.addVerb(row);
                else controller.addPhrase(row);
            }
        }

        cell = document.createElement('td');
        row.appendChild(cell);

        var controlClass = 'phrase-table-row-control w3-round w3-btn w3-black'

        button = PhraseTableButtonControl('PhraseTableRowClear', 'clear', 'void', function(event){
            var parent = row.parentElement;
            row.remove();
            if (parent.childElementCount === 0) controller.addPhrase();
        });

        button.className = controlClass;
        cell.appendChild(button);

        button = PhraseTableButtonControl('PhraseTableRowMoveUp', 'expand_less', 'move-up', function(event){
            var it = row;
            var prev = row.previousSibling;
            if (! prev ) return;
            var parent = row.parentNode;
            it.remove();
            parent.insertBefore(row, prev);
        });

        button.className = controlClass;
        cell.appendChild(button);

        button = PhraseTableButtonControl('PhraseTableRowMoveDown', 'expand_more', 'move-down', function(event){
            var it = row;
            var prev = row.nextSibling;
            if (! prev ) return;
            var parent = row.parentNode;
            prev.remove();
            parent.insertBefore(prev, row);
        });
        button.className = controlClass;
        cell.appendChild(button);

    },

    addVerb: function(after) {

        var row, cell, controller = this;

        row = this.body.insertRow();
        row.controls = [PhraseTableVerbSelector()];
        cell = document.createElement('td');
        cell.appendChild(row.controls[0]);
        cell.colSpan = 4;
        row.appendChild(cell);
        if (after) {
            after.parentNode.insertBefore(row, after.nextSibling);
        }
        row.controls[0].focus();

        var controlClass = 'phrase-table-row-control w3-round w3-btn w3-black'

        button = PhraseTableButtonControl('PhraseTableRowClear', 'clear', 'void', function(event){
            var parent = row.parentElement;
            row.remove();
            if (parent.childElementCount === 0) controller.addPhrase();
        });

        button.className = controlClass;
        cell.appendChild(button);

        button = PhraseTableButtonControl('PhraseTableRowMoveUp', 'expand_less', 'move-up', function(event){
            var it = row;
            var prev = row.previousSibling;
            if (! prev ) return;
            var parent = row.parentNode;
            it.remove();
            parent.insertBefore(row, prev);
        });

        button.className = controlClass;
        cell.appendChild(button);

        button = PhraseTableButtonControl('PhraseTableRowMoveDown', 'expand_more', 'move-down', function(event){
            var it = row;
            var prev = row.nextSibling;
            if (! prev ) return;
            var parent = row.parentNode;
            prev.remove();
            parent.insertBefore(prev, row);
        });
        button.className = controlClass;
        cell.appendChild(button);

    },

    getForwardSyntax: function() {
        var data = [];
        for (var r in this.body.childNodes) {
            var row = this.body.childNodes[r];
            for (var c in row.controls) {
                var control = row.controls[c];
                data.push(control.value);
            }
        }
        this.documentView.innerText = data.join(' ');
    },

    getBackwardSyntax: function() {
        var data = [];
        for (var r = this.body.childNodes.length - 1; r > -1; r--) {
            var row = this.body.childNodes[r];
            for (var c in row.controls) {
                var control = row.controls[c];
                if (control.typeClaim === 5) data.push(PSG.positionCatalog[control.value]);
                else data.push(control.value);
            }
        }
        this.documentView.innerText = data.join(' ');
    }
}

function PhraseTableButtonControl(id, materialIcon, title, action) {
    var div = document.createElement('div');
    var icon = document.createElement('i');
    div.className = 'phrase-table-button-control w3-round w3-btn w3-black';
    if (id) div.id = id;
    if (title) div.title = title;
    if (action) div.onclick = action;
    icon.className = 'material-icons';
    icon.innerText = materialIcon;
    div.appendChild(icon);
    return div;
}

function PhraseTablePositionSelector() {
    var sel = document.createElement('select')
    sel.typeClaim = 5;
    sel.className = 'phrase-position-selector';
    for (var i = 0; i < PSG.positionTerm.length; i++) {
        var opt = document.createElement('option');
        opt.className = 'phrase-position-selector-option';
        opt.text = PSG.positionTerm[i];
        opt.value = opt.text;
        sel.appendChild(opt);
    }
    return sel;
}

function PhraseTableVerbSelector() {
    var sel = document.createElement('select')
    sel.typeClaim = 2;
    sel.className = 'phrase-verb-selector';
    for (var i = 0; i < PSG.thinkingTerm.length; i++) {
        var opt = document.createElement('option');
        opt.className = 'phrase-verb-selector-option';
        opt.text = PSG.thinkingTerm[i];
        opt.value = opt.text;
        sel.appendChild(opt);
    }
    return sel;
}

function PhraseTableLodialSelector() {
    var sel = document.createElement('select')
    sel.typeClaim = 6
    sel.className = 'phrase-lodial-selector';
    for (var i = 0; i < PSG.lodialTerm.length; i++) {
        var opt = document.createElement('option');
        opt.className = 'phrase-lodial-selector-option';
        opt.text = PSG.lodialTerm[i];
        opt.value = opt.text;
        sel.appendChild(opt);
    }
    return sel;
}

function PhraseTableFactEditor() {
    var editor = document.createElement('input');
    editor.typeClaim = 7;
    editor.className = 'phrase-fact-editor';
    editor.setAttribute('spellcheck', 'true');
    editor.oninput = function(){this.value = this.value.toUpperCase();};
    return editor;
}
