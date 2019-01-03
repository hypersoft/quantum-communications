
var PSG = {
    voidString: "",
    sentenceOperationTerm: ["CAUSE", "CONSEQUENCE", "THINKING", "POSESSION", "AUTHORITY"],
    grammarTerm: ["CONJUNCTION", "ADVERB", "VERB", "ADJECTIVE", "PRONOUN", "POSITON", "LODIAL", "FACT", "PAST-TIME-FICTION", "FUTURE-TIME-FICTION"],
    conjunctionTerm: ["AND", "OR", "&:", "AND:", "OR:"],
    postionTerm: [],
    lodialTerm: ["A", "AN", "THE", "THIS", "THESE", "THOSE", "HIS", "HER", "MY", "YOUR", "OUR"],
    thinkingTerm: ["IS", "ARE", "IS:", "ARE:"],
    positionCatalog: {},
    createPosition: function(a, b){
        PSG.positionCatalog[a] = b;
        PSG.positionCatalog[b] = a;
        PSG.postionTerm.push(a);
        PSG.postionTerm.push(b);
    }
};

PSG.createPosition("FOR", "BY");
PSG.createPosition("WITH", "OF");
PSG.createPosition("IN", "OUT");
PSG.createPosition("ON", "OFF");
PSG.createPosition("THROUGH", "ROUND");
PSG.createPosition("WITHIN", "OUTSIDE");

function PSGSentence(speech) {
    this.speech = speech || [];
}

PSGSentence.prototype = {
    constructor: PSGSentence,
    speech: [], // phrase or verb
}

function PSGSentencePhrase(position, lodial, fact) {
    this.position = position || PSG.voidString, 
    this.lodial = lodial || PSG.voidString, 
    this.fact = fact || PSG.voidString;
}

PSGSentencePhrase.prototype = {
    constructor: PSGSentencePhrase,
    position: PSG.voidString,
    lodial: PSG.voidString,
    fact: PSG.voidString,
}
