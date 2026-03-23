"Script Pharo pour calculer les métriques et afficher les résultats"

| model classesToAnalyze metricsResults |

model := MooseModel root allModels last.
classesToAnalyze := model allModelClasses.

metricsResults := classesToAnalyze collect: [ :eachClass |
  | fanIn fanOut wmc |
  fanIn := (eachClass queryAllIncoming collect: #source) asSet size.
  fanOut := (eachClass queryAllOutgoing collect: #target) asSet size.
  wmc := eachClass methods inject: 0 into: [ :sum :m | sum + (m numberOfParameters + 1) ].
  {
    'ClassName' -> eachClass name .
    'LOC' -> (eachClass numberOfLinesOfCode ifNil: [0]) .
    'NOM' -> eachClass methods size .
    'FanIn' -> fanIn .
    'FanOut' -> fanOut .
    'WMC' -> wmc
  } asDictionary.
].
metricsResults asOrderedCollection inspect.
