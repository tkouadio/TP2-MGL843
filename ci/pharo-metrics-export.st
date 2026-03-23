"============================================================"
"Script Pharo - Export des métriques de qualité en CSV"
"============================================================"
"Ce script est exécuté dans une image Moose par smalltalkCI."
"Il effectue 3 étapes :"
"  1. Charger le modèle Famix (model.json) généré par ts2famix"
"  2. Extraire les métriques de chaque classe (NOM, NOA, LOC)"
"  3. Écrire les résultats dans export_metrics.csv"
"============================================================"

| modelFile model classes stream writer |

"--- 1. Localiser le fichier model.json ---"
"On cherche d'abord dans le répertoire courant,"
"puis dans le workspace GitHub Actions si non trouvé."
modelFile := './model.json' asFileReference.

modelFile exists ifFalse: [
    modelFile := (Smalltalk os environment at: 'GITHUB_WORKSPACE' ifAbsent: [ '.' ]), '/model.json'.
    modelFile := modelFile asFileReference.
].

Transcript show: 'CI Export Script - Start'; cr.
Transcript show: 'Model file path: ', modelFile fullName; cr.
Transcript show: 'File exists: ', modelFile exists printString; cr.

modelFile exists ifFalse: [
    Transcript show: 'model.json not found'; cr.
    self error: 'model.json not found'.
].

"--- 2. Charger le modèle JSON dans Moose ---"
"FamixTypeScriptModel est la classe du métamodèle chargée à l'étape"
"précédente par Metacello (via moose-config.ston)."
"importFromJSONStream: lit le JSON et crée les entités Famix en mémoire."
Transcript show: 'Loading model into Moose...'; cr.
modelFile readStreamDo: [ :readStream |
    model := FamixTypeScriptModel new importFromJSONStream: readStream.
    model install.
].
Transcript show: 'Model loaded.'; cr.

"--- 3. Extraire les métriques et écrire le CSV ---"
"allModelClasses retourne toutes les entités de type FamixTypeScriptClass."
classes := model allModelClasses.
Transcript show: 'Classes found: ', classes size printString; cr.

"Ouverture du fichier CSV en écriture avec NeoCSV (inclus dans Pharo)."
"Séparateur : virgule (,) pour compatibilité avec le format demandé."
stream := './export_metrics.csv' asFileReference writeStream.
writer := NeoCSVWriter on: stream.
writer separator: $,.

"En-tête du CSV"
writer nextPut: #( 'ClassName' 'LOC' 'NOM' 'FanIn' 'FanOut' 'WMC' ).

"Pour chaque classe, on calcule les métriques demandées."
classes do: [ :each |
    | loc anchor srcFile content snippet fanIn fanOut wmc |
    loc := 0.

    "LOC : priorité au calcul via le sourceAnchor, sinon somme des LOC des méthodes."
    anchor := each sourceAnchor.
    (anchor notNil and: [ anchor isKindOf: FamixTypeScriptIndexedFileAnchor ]) ifTrue: [
        srcFile := anchor fileName asFileReference.
        srcFile exists ifTrue: [
            content := srcFile contents.
            snippet := content copyFrom: anchor startPos to: (anchor endPos min: content size).
            loc := snippet lineCount.
        ].
    ].
    loc = 0 ifTrue: [
        loc := each methods inject: 0 into: [ :sum :m | sum + (m numberOfLinesOfCode ifNil: [ 0 ]) ].
    ].

    "FanIn : nombre d'éléments qui pointent vers la classe."
    fanIn := (each queryAllIncoming collect: #source) asSet size.

    "FanOut : nombre d'éléments pointés par la classe."
    fanOut := (each queryAllOutgoing collect: #target) asSet size.

    "WMC : Weighted Methods per Class (somme des paramètres + 1 pour chaque méthode)."
    wmc := each methods inject: 0 into: [ :sum :m | sum + ((m numberOfParameters ifNil: [0]) + 1) ].

    Transcript show: '  ', each name, ' loc:', loc printString; cr.
    writer nextPut: {
        each name.
        loc.
        each methods size.
        fanIn.
        fanOut.
        wmc
    }.
].

stream close.

Transcript show: 'Export complete - export_metrics.csv'; cr.
