
var PSG = {
    voidString: "",
    sentenceOperationTerm: ["CAUSE", "CONSEQUENCE", "THINKING", "POSESSION", "AUTHORITY"],
    grammarTerm: ["CONJUNCTION", "ADVERB", "VERB", "ADJECTIVE", "PRONOUN", "POSITON", "LODIAL", "FACT", "PAST-TIME-FICTION", "FUTURE-TIME-FICTION"],
    conjunctionTerm: ["AND", "OR", "&:", "AND:", "OR:"],
    positionTerm: [],
    lodialTerm: ["A", "AN", "THE", "THIS", "THESE", "THOSE", "THEIR", "HIS", "HER", "MY", "YOUR", "OUR"],
    thinkingTerm: ["IS", "ARE", "IS:", "ARE:"],
    positionCatalog: {},
    createPosition: function(a, b){
        PSG.positionCatalog[a] = b || a;
        PSG.positionTerm.push(a);
        if (b) {
            PSG.positionTerm.push(b);
            PSG.positionCatalog[b] = a;    
        }
    }
};

PSG.createPosition("FOR", "BY");
PSG.createPosition("WITH", "OF");

// these words don't have backward analogs which make sense.
// by, for of and with should be sufficient for checking the work;
// otherwise we'd need an extensive word catalog of analogs for fact-words;
// and that might not even work... not all words have analogs;
// on the 4th-day is not off the 4th-day... etc
// -- Triston-Jerard: Taylor

PSG.createPosition("AS"); // as is always as in a mirror
//PSG.createPosition("IN", "OUT"); // non-sense
PSG.createPosition('IN');
PSG.createPosition('OUT');
//PSG.createPosition("ON", "OFF"); // non-sense
PSG.createPosition('ON');
PSG.createPosition('OFF');
//PSG.createPosition("THROUGH", "ROUND"); // non-sense
PSG.createPosition("THROUGH"); 
PSG.createPosition("ROUND"); // [A]ROUND 
//PSG.createPosition("WITHIN", "OUTSIDE"); // non-sense
PSG.createPosition("WITHIN"); 
PSG.createPosition("OUTSIDE"); 

delete PSG.createPosition;

PSG.Sentence = function (speech) {
    this.speech = speech || [];
}

PSG.Sentence.prototype = {
    constructor: PSG.Sentence,
    speech: [], // phrase or verb
}

PSG.Phrase = function (position, lodial, fact) {
    this.position = position || PSG.voidString, 
    this.lodial = lodial || PSG.voidString, 
    this.fact = fact || PSG.voidString;
}

PSG.Phrase.prototype = {
    constructor: PSG.Phrase,
    position: PSG.voidString,
    lodial: PSG.voidString,
    fact: PSG.voidString,
}
