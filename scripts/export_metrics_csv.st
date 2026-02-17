name: CI Analysis & Tests

on:
  pull_request:
    branches: [ "**" ]
  push:
    branches: [ main, master, dev ]

jobs:
  analysis:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'

      - name: Install JS Dependencies
        run: |
          npm ci
          npm install -g ts2famix

      - name: Run JS Tests
        run: npm test

      - name: Generate FAMIX Model
        run: ts2famix -i tsconfig.json -o TP2-mgl843-model.json

      - name: Install Pharo, Moose & NeoCSV
        run: |
          curl -L https://get.pharo.org/64/110+vm | bash
          # Suppression de l'erreur SSH potentielle en forçant HTTPS via env
          ./pharo Pharo.image eval --save "
            [ 
              Metacello new
                baseline: 'Moose';
                repository: 'github://moosetechnology/Moose:development/src';
                load: 'Model'.
              Metacello new
                baseline: 'NeoCSV';
                repository: 'github://svenvc/NeoCSV';
                load.
            ] on: Error do: [ :ex | Stdio stdout nextPutAll: ex description; lf. ex resume ].
          "
          wget -nc https://files.pharo.org/sources/PharoV110.sources

      - name: Execute Metrics Calculation
        # Ajout de --headless pour garantir qu'aucune fenêtre ne tente de s'ouvrir
        run: ./pharo --headless Pharo.image st scripts/calc_metrics.st --quit

      - name: Execute Export CSV
        run: ./pharo --headless Pharo.image st scripts/export_metrics_csv.st --quit

      - name: Upload CSV Results
        if: success() # S'assure que l'upload ne se fait que si les étapes précédentes ont réussi
        uses: actions/upload-artifact@v4
        with:
          name: metrics-report
          path: metrics_tp2.csv