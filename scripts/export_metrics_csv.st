"Script Pharo pour exporter les métriques en CSV - Version CI"

| model classes fileStream writer |

"1. Importation explicite du modèle pour éviter les erreurs de contexte en CI"
model := MooseModel root importModel: 'TP2-mgl843-model.json' asFileReference.
classes := model allModelClasses.

fileStream := 'metrics_tp2.csv' asFileReference writeStream.

[
    writer := NeoCSVWriter on: fileStream.
    writer separator: $,.
    
    "Header"
    writer nextPut: #('ClassName' 'LOC' 'NOM' 'FanIn' 'FanOut' 'WMC').

    "Data Rows"
    classes do: [ :each |
        | fIn fOut wmcValue |
        fIn := (each queryAllIncoming collect: #source) asSet size.
        fOut := (each queryAllOutgoing collect: #target) asSet size.
        wmcValue := each methods inject: 0 into: [ :sum :m | sum + (m numberOfParameters + 1) ].

        writer nextPut: { 
            each name. 
            (each numberOfLinesOfCode ifNil: [0]). 
            each methods size. 
            fIn. 
            fOut. 
            wmcValue 
        }
    ].
] ensure: [ fileStream close ].

"Remplacer inform: par un log console pour la CI"
Stdio stdout nextPutAll: 'Succès : CSV exporté vers metrics_tp2.csv'; lf.