"Script Pharo pour exporter les métriques en CSV"

| model classes fileStream writer |

model := MooseModel root allModels last.
classes := model allModelClasses.
fileStream := 'metrics_tp2.csv' asFileReference writeStream.
[
    writer := NeoCSVWriter on: fileStream.
    writer separator: $,.
    writer nextPut: #('ClassName' 'LOC' 'NOM' 'FanIn' 'FanOut' 'WMC').
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
self inform: 'CSV exported to: ', 'metrics_tp2.csv' asFileReference fullName.
