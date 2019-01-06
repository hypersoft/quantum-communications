HTMLTextAreaElement.prototype.insertAtCaret = function (text) {
    text = text || '';
    if (document.selection) {
      // IE
      this.focus();
      var sel = document.selection.createRange();
      sel.text = text;
    } else if (this.selectionStart || this.selectionStart === 0) {
      // Others
      var startPos = this.selectionStart;
      var endPos = this.selectionEnd;
      this.value = this.value.substring(0, startPos) +
        text +
        this.value.substring(endPos, this.value.length);
      this.selectionStart = startPos + text.length;
      this.selectionEnd = startPos + text.length;
    } else {
      this.value += text;
    }
  };
  
  function TabPanel(id) {
    this.element = document.createElement('div');
    this.element.controller = this;
    this.element.className = 'tab-panel';
    if (id) this.element.id = id;
    this.buttonBar = document.createElement('div');
    this.element.appendChild(this.buttonBar);
    this.buttonBar.className = 'tab-panel-button-bar w3-bar w3-black';
    this.contentPanel = document.createElement('div');
    this.element.appendChild(this.contentPanel);
    this.contentPanel.className = 'tab-panel-contents';
}

TabPanel.prototype = {

    constructor: TabPanel,

    addTab: function(id, label) {

        var controller = this, doc = document.createElement('div');
        doc.className = 'tab-panel-document';
        doc.id = id;
        this.contentPanel.appendChild(doc);
        doc.show = function() {
            controller.selectTab(id);
        }
        var button = document.createElement('button');
        button.className = 'tab-panel-button w3-bar-item w3-button';
        button.id = id+'Button';
        button.innerText = label;

        var controller = this;

        button.onclick = function(event) {
            controller.selectTab(id);
        }

        this.buttonBar.appendChild(button);

        return doc;

    },
    selectTab: function(id) {
        var panels = this.contentPanel.childNodes;
        var panel;
        for (i = 0; i < panels.length; i++) {
            if (panels[i].id === id) panel = panels[i];
            panels[i].style.display = "none";  
        }
        panel.style.display = "block";
    }
}

// Creates an HTML Table manager for editing PSG phrases and sentences
function PhraseTable(id, textarea) {

    this.element = document.createElement('TABLE');
    this.textarea = textarea;

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
    var button, controller = this;

    var footerRowCell = document.createElement('td');
    footerRow.appendChild(footerRowCell);
    footerRowCell.colSpan = 4;

    footerRowCell.appendChild(PhraseTableButtonControl('PhraseTableClearPhrases', 'backspace', 'clear-form', function (event){
        controller.clearPhrases();
    }));
    
    footerRowCell.appendChild(PhraseTableButtonControl('PhraseTableAddPhrase', 'add', 'new-phrase', function(event) {
        controller.addPhrase();
    }));

    footerRowCell.appendChild(button = PhraseTableButtonControl('PhraseTableAddPunctuation', 'list', 'thought-ending', function(event) {
        controller.addPunctuation();
    }));

    footerRowCell.appendChild(PhraseTableButtonControl('PhraseTablePlaceVerb', 'all_inclusive', 'is/are', function (event){
        controller.addVerb();
    }));

    footerRowCell.appendChild(button = PhraseTableButtonControl('PhraseTableEndingTypeToggle', 'add', 'sentence-type: statement/question', function(event) {
        if (controller.question) {
            controller.question = false;
            this.icon.innerText = '.';
        } else {
            controller.question = true;
            this.icon.innerText = '?';
        }
    }));
    this.endingTypeToggle = button;
    button.icon.className = 'text-icons';
    button.icon.innerText = '.';

    footerRowCell.appendChild(PhraseTableButtonControl('PhraseTableCompileClaimBackwards', 'chevron_left', 'view-claim-backwards', function(event){
        controller.documentView.innerText = controller.getBackwardSyntax();
    }));

    footerRowCell.appendChild(PhraseTableButtonControl('PhraseTableCompileClaimForwards', 'chevron_right', 'view-claim-forwards', function(event){
        controller.documentView.innerText = controller.getForwardSyntax();
    }));

    footerRowCell.appendChild(PhraseTableButtonControl('PhraseTableWriteClaim', 'edit', 'write-claim', function(event){
        controller.textarea.show();
        controller.textarea.insertAtCaret(controller.getForwardSyntax());
        controller.clearPhrases();
    }));

    footerRow = document.createElement('tr');
    this.footer.appendChild(footerRow);
    footerRowCell = document.createElement('td');
    footerRowCell.colSpan = 4;
    footerRowCell.className = 'phrase-table-document-view';
    footerRowCell.id = 'documentView';
    footerRow.appendChild(footerRowCell);
    this.documentView = footerRowCell;

    this.hasVerb = false;

    this.addPhrase();

}

PhraseTable.prototype = {

    constructor: PhraseTable,

    clearPhrases: function() {
        this.body.innerHTML = '';
        this.hasVerb = false;
        this.question = false;
        this.endingTypeToggle.icon.innerText = '.';
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

        button = PhraseTableButtonControl('PhraseTableRowMute', 'mic', 'mute', function(event){
            if (row.muting) {
                row.muting = false;
                this.icon.innerText = 'mic';
            } else {
                row.muting = true;
                this.icon.innerText = 'mic_off';
            }
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

        if (this.hasVerb) {
            alert(": Syntax-Fault\n\n for the claim of the quantum-communications-sentences are with a single-verb-usage within the sentence for the quantum-certification.");
            return;
        } else {
            this.hasVerb = true;
        }
        var row, cell, controller = this;

        row = this.body.insertRow();
        row.controls = [PhraseTableVerbSelector()];
        cell = document.createElement('td');
        cell.appendChild(row.controls[0]);

        row.controls[0].onkeypress = function(event) {
            if (event.keyCode == 13 || event.which == 13){
                if (event.shiftKey) controller.addVerb(row);
                else controller.addPhrase(row);
            }
        }

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
            controller.hasVerb = false;
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

    addPunctuation: function(after) {

        var row, cell, controller = this;

        row = this.body.insertRow();
        row.controls = [PhraseTablePunctuation()];
        cell = document.createElement('td');
        cell.appendChild(row.controls[0]);

        row.controls[0].onkeypress = function(event) {
            if (event.keyCode == 13 || event.which == 13){
                if (event.shiftKey) controller.addVerb(row);
                else controller.addPhrase(row);
            }
        }

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
            controller.hasVerb = false;
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
            if (row.muting) continue;
            for (var c in row.controls) {
                var control = row.controls[c];
                if (control.typeClaim === 10) data.push(data.pop() + control.value);
                else data.push(control.value);
            }
        }
        return data.join(' ') + ((this.question)?'?':'.');
    },

    getBackwardSyntax: function() {
        var data = [];
        for (var r = this.body.childNodes.length - 1; r > -1; r--) {
            var row = this.body.childNodes[r];
            if (row.muting) continue;
            for (var c in row.controls) {
                var control = row.controls[c];
                if (control.typeClaim === 5) data.push(PSG.positionCatalog[control.value]);
                else if (control.typeClaim === 10) data.push(data.pop() + control.value);
                else data.push(control.value);
            }
        }
        return data.join(' ') + ((this.question)?'?':'.');
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
    div.icon = icon;
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

function PhraseTablePunctuation() {
    var sel = document.createElement('select')
    sel.typeClaim = 10;
    var punctuation = [',', ';'];
    sel.className = 'phrase-punctuation-selector';
    for (var i = 0; i < punctuation.length; i++) {
        var opt = document.createElement('option');
        opt.className = 'phrase-punctuation-selector-option';
        opt.text = punctuation[i];
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
    return editor;
}
