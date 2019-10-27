var lines = [""];
var rhymes = [];
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var rhymeColors = [];
var colorValNum = 0;
var colorValDenom = 1;

var lineTemplate = "<div class=\"line-container\"><input class=\"inputbox\" type=\"text\" oninput=\"handleInput(#)\" onkeydown=\"handleKeyDown(#, event)\" autocomplete=\"off\" id=\"input-#\" placeholder=\". . .\"><p class=\"syllable-counter\" id=\"counter-#\">0</p><p class=\"rhymer\" id=\"rhymer-#\"></p></div>";

function nextLine(id) {
    return Math.min(id + 1, lines.length - 1);
}

function prevLine(id) {
    return Math.max(id - 1, 0);
}

function getInput(id) {
    return document.getElementById("input-" + id).value;
}

function shiftFocus(id) {
    document.getElementById("input-" + id).focus();
}

function handleInput(id) {
    updateSyllableCount(id);
}

function handleKeyDown(id, event) {
    //up arrow
    if(event.keyCode == 38) {
        shiftFocus(prevLine(id));
        return;
    }

    //down arrow
    if(event.keyCode == 40) {
        shiftFocus(nextLine(id));
        return;
    }

    //new line
    if(event.keyCode == 13) {
        handleNewLine(id);
        return;
    }

    //delete
    if (lines.length > 1 && getInput(id) === "" && event.keyCode == 8) {
        deleteLine(id);
        return;
    }
}

function handleNewLine(id) {
    initLines();
    addLine(id);
    updateLines();
    updateAllRhymes();
    shiftFocus(nextLine(id));
}

function initLines() {
    for (var i = 0; i < lines.length; i++) {
        lines[i] = document.getElementById("input-" + i).value;
    }
}

function addLine(id) {
    lines.splice(id + 1, 0, "");
}

function updateLines() {
    var containedHTML = "";
    for (var i = 0; i < lines.length; i++) {
        containedHTML += lineTemplate.replace(/#/g, i);
    }
    document.getElementById("inputs").innerHTML = containedHTML;

    for (var i = 0; i < lines.length; i++) {
        document.getElementById("input-" + i).value = lines[i];
        updateSyllableCount(i);
    }
}

function deleteLine(id) {
    initLines();

    lines.splice(id, 1);
    rhymes.splice(id, 1);

    updateLines();
    updateAllRhymes();

    var prevLineId = prevLine(id);
    var prevText = lines[prevLineId] + " ";
    shiftFocus(prevLineId);
    document.getElementById("input-" + prevLineId).value = prevText;
}

function updateSyllableCount(id) {
    var totalSyllables = 0;

    var words = getInput(id).split(' ');
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (word.trim() !== "") {
            totalSyllables += RiTa.getSyllables(RiTa.stripPunctuation(word)).split('/').length;
        }
    }

    document.getElementById("counter-" + id).innerHTML = totalSyllables;
}

function updateRhymeDisplay() {
    for (var i = 0; i < lines.length; i++) {
        document.getElementById("rhymer-" + i).innerHTML = getAlpha(rhymes[i]);
        // document.getElementById("rhymer-" + i).style.color = "#" + getColor(rhymeColors[rhymes[i]]);
    }
}

function getAlpha(rhymeKey) {
    if (rhymeKey == -1) {
        return "";
    }

    if (rhymeKey < alphabet.length) {
        return alphabet[rhymeKey];
    }

    return getAlpha(rhymeKey % alphabet.length).repeat(Math.floor(rhymeKey / alphabet.length) + 1);
}

function updateAllRhymes() {
    rhymes = [];
    for (var i = 0; i < lines.length; i++) {
        updateLineRhyme(i);
    }

    updateRhymeDisplay();
}

function updateLineRhyme(id) {
    if (lines[id] === "") {
        rhymes.push(-1);
        return;
    }

    for (var i = 0; i < rhymes.length; i++) {
        curLastWord = lastWord(lines[id]);
        otherLastWord = lastWord(lines[i]);

        if (curLastWord.toLowerCase() === otherLastWord.toLowerCase() || RiTa.isRhyme(curLastWord, otherLastWord)) {
            rhymes.push(rhymes[i]);
            return;
        }
    }
    rhymes.push(getNextRhyme());
}

function lastWord(line) {
    var words = RiTa.stripPunctuation(line).split(' ');
    return words[words.length - 1];
}

function getNextRhyme() {
    if (rhymes.length == 0) {
        return 0;
    }
    var max = rhymes[0];
    for (var i = 0; i < rhymes.length; i++) {
        if (max < rhymes[i]) {
            max = rhymes[i];
        }
    }

    rhymeColors.push(colorValNum / colorValDenom);
    colorValNum += 2;
    if (colorValNum >= colorValDenom) {
        colorValNum = 1;
        colorValDenom *= 2;
    }

    return max + 1;
}

function getColor(value) {
    r = Math.floor(clamp01(2 - (6 * (Math.abs(Math.round(value) - value)))) * 192);
    g = Math.floor(clamp01(2 - (6 * (Math.abs(Math.round(value + (2/3)) - (value + (2/3)))))) * 192);
    b = Math.floor(clamp01(2 - (6 * (Math.abs(Math.round(value + (1/3)) - (value + (1/3)))))) * 192);
    return (r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0'));
}

function clamp01(value) {
    return Math.min(Math.max(0, value), 1)
}

function copyAll() {
    initLines();

    var poem = "";
    poem += document.getElementById("title").value += "\n\n";

    for(var i = 0; i < lines.length; i++) {
        poem += lines[i];
        if(i < lines.length - 1) {
            poem += "\n";
        }
    }

    var el = document.createElement('textarea');
    el.value = poem;

    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function clearAll() {
    lines = [""];
    rhymes = [];
    rhymeColors = [];
    updateLines();
    shiftFocus(0);

    document.getElementById("title").value = "";
}
