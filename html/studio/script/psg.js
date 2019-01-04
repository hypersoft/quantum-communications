
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
        PSG.positionCatalog[a] = b;
        PSG.positionCatalog[b] = a;
        PSG.positionTerm.push(a);
        PSG.positionTerm.push(b);
    }
};

PSG.createPosition("FOR", "BY");
PSG.createPosition("WITH", "OF");
PSG.createPosition("IN", "OUT");
PSG.createPosition("ON", "OFF");
PSG.createPosition("THROUGH", "ROUND");
PSG.createPosition("WITHIN", "OUTSIDE");

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
