class PoemStructure {
    constructor(name, lines) {
        this.name = name;
        this.lines = lines;
    }

    getSyllablesForLine(id) {
        return this.lines[id].syllableCount;
    }

    getRhymeForLine(id) {
        return this.lines[id].rhymeLetter;
    }
}

class Haiku extends PoemStructure {
    constructor() {
        var lines = []
        lines.push(new LineData(5, ''));
        lines.push(new LineData(7, ''));
        lines.push(new LineData(5, ''));

        super("Haiku", lines);
    }
}

class Sonnet extends PoemStructure {
    constructor() {
        var lines = []
        lines.push(new LineData());
    }
}

class LineData {
    constructor(syllableCount, rhymeLetter) {
        this.syllableCount = syllableCount;
        this.rhymeLetter = rhymeLetter;
    }
}
