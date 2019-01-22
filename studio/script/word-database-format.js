/* : WORD-DATABASE-FORMAT FOR A SOFWARE-BASED-DICTIONARY-(MANAGEMENT AND BROWSING)-SYSTEM */
/* : COPY-RIGHTS: Triston-Jerard: Taylor; Hypersoft-Systems: U.-S.-A.: ~January-~5-~2019. */
/* : CODIFCATION-LANGUAGE: "JavaScript" */
/* : LANGUAGE-CLOSURES:
    "prototype"=model, "unique"=one-of-a-scope-kind, "identity"=semi-numeric-(handle or moniker)
*/

Word = function(/* semantic-function */) {}

Word.prototype = {

    constructor: Word,
    dataTag: null, /* for the "unique data identity" */
    spelling: null, /* for the spelling of this word */
    part: [], /* for the breakdown of the word-spelling */
    meaning: [],  /* for the listing of the multiple-meanings with the data-tags */

    /* : COMMENTARY:
        unlike most dictionaries, we recognize that very little data is actually
        associated with the spelling of a word, due to multiple langauges and usages.
        however, the spelling and the parts, will always be the same for a particular
        word, with a particular data-tag. multiple entries of the same spelling
        with different parts are a possiblity. What distinguishes them, are the
        data-tag-fields[ for the computers], and the parts and meanings[
        for the readers/editors].
    */

}

Word.Meaning = function(/* semantic-function */) {}

Word.Meaning.prototype = {

    constructor: Word.Meaning,
    dataTag: null, /* for the "unique data identity" */
    spelling: null, /* for the data-tag of the spelling */
    synonym: [], /* for the listing of the similar-words of the meaning by the spellings */
    fieldOfStudy: null, /* for the context-specification */
    grammarClass: null, /* for the grammar-class of the meaning */
    language: null, /* for the language of the meaning */
    languageOfOrigin: null, /* for the historical-langauge-origin */
    periodOfOrigin: null, /* for the historical-time-data */
    placeOfOrigin: null, /* for the known-place of the meaning-origin */
    analog: null, /* for a possible-word of an exact-polar-difference with a data-tag */
    gender: null, /* for the neutral/masculine/feminine: 0=neutral, 1=masculine, 2=feminine */
    claim: null, /* for the text-data of the meaning */
    timestamp: 0, /* for the date of the claim-writing */
    formal: null, /* for the boolean-claim of the usage: formal/slang */
    author: null, /* for the author of the spelling within the word-catalog */

    /* : COMMENTARY:
        field of study: is a string value, or a data-tag of compiled or known: study-fields
        grammar class: is a value within an array of grammar classes linked to the language
        language, and language of origin: is a value within an array of known languages
        period of origin: is a string description
        place of origin: is a string description
        timestamp: a computer generated timestamp for the time of entry in the number of milliseconds since the "unix epoch"
    */
}
