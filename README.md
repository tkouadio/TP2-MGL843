# TP2 – Évaluer la qualité d’un projet TypeScript

> **MGL843 – Sujets avancés en conception logicielle**
>
> ![CI Status](https://img.shields.io/badge/CI-GitHub_Actions-blue?logo=github-actions) ![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript) ![Moose](https://img.shields.io/badge/Analysis-Moose-orange)

---

## 📌 Description

Ce projet est une évolution du **TP1** dans le cadre du cours **MGL843**. L’objectif est d'accroître la complexité du système pour évaluer la **qualité de la conception logicielle** en introduisant une architecture orientée objets, de nouvelles exigences (FURPS) et une interface Web dynamique.

L’application est un **gestionnaire de notes** complet permettant :

- **CRUD complet** : Création, modification et suppression de notes
- **Organisation** : Gestion de tags dynamiques
- **Recherche** : Filtrage par titre, contenu ou tag
- **Interface Web** : Interaction intuitive développée avec le moteur de template **Pug**

---

## 🧩 Architecture & Design

Le projet suit une séparation stricte des responsabilités pour améliorer la **maintenabilité** et la **testabilité** :

```text
src/
├── domain/
│   └── Note.ts                       # Entité métier (note + tags + règles)
├── persistence/
│   └── NotesRepository.ts            # FileNotesRepository (persistance JSON)
├── services/
│   └── NotesService.ts               # Logique métier (CRUD, tags, recherche)
├── web/
│   ├── app.ts                        # Application Express
│   ├── routes.ts                     # Routes HTTP (/notes)
│   └── views/                        # Templates Pug
│       ├── layout.pug
│       ├── index.pug
│       ├── note_form.pug
│       └── note_edit.pug
├── index.ts                          # Façade / compatibilité (NoteManager)
├── notes.ts                          # Code legacy / utilitaire (TP1)
tests/
├── notes.test.ts                     # Tests unitaires (logique métier)
└── web.e2e.test.ts                   # Tests E2E (frontend + routes HTTP)
scripts/
└── copy-views.js                     # Script de build (copie des vues Pug)
.github/
└── workflows/
    └── ci.yml                        # CI: Tests exécutés à chaque push/PR
```

---

## ⚙️ CI/CD & Analyse de Qualité

Le projet intègre un pipeline de CI (Intégration Continue) avancé via GitHub Actions qui automatise l'analyse de qualité à chaque push.

### Pipeline d'analyse Moose/Pharo

1. **Validation** : Exécution des tests Jest
2. **Modélisation** : Utilisation de `ts2famix` pour générer un modèle `model.json`
3. **Analyse Statistique** : Un script Smalltalk charge le modèle dans Moose et calcule :
   - **LOC** : Lignes de code par classe
   - **NOM** : Nombre de méthodes
   - **WMC** : Complexité cyclomatique pondérée (somme des paramètres + 1)
   - **Couplage** : FanIn (dépendances entrantes) et FanOut (dépendances sortantes)
4. **Reporting** : Export automatique vers `export_metrics.csv`

Exemple de CSV généré :

```
ClassName,LOC,NOM,FanIn,FanOut,WMC
MaClasse,85,12,3,2,15
AutreClasse,30,5,1,1,6
```

Les fichiers `model.json` et `export_metrics.csv` sont archivés comme artifacts téléchargeables dans l’onglet Actions de GitHub.

---

## 🛠️ Stack Technique

- **Backend** : Node.js, Express, TypeScript
- **Frontend** : Pug (Templates HTML), CSS
- **Tests** : Jest, Supertest
- **Analyse de code** : Moose, Pharo, FamixTypeScript, ts2famix

---

## ▶️ Installation et Utilisation

### 1. Prérequis

- Node.js (v18+)
- npm

### 2. Installation

```bash
npm install
```

### 3. Lancer l'application

```bash
# Mode développement (rechargement automatique)
npm run dev:web
```

Accès : [http://localhost:3000/notes](http://localhost:3000/notes)

### 4. Exécuter les tests

```bash
npm test
```

---

## 📊 Génération manuelle des métriques

Si vous souhaitez générer le modèle Famix localement pour l'importer dans Moose :

1. **Générer le JSON** :

```bash
ts2famix -i tsconfig.json -o TP2-MGL843-model.json
```

2. **Importer dans Moose** :
   - Ouvrez Moose
   - Importez le fichier `TP2-MGL843-model.json` via le panneau d'importation Famix
   - Utilisez les scripts du dossier `scripts/` ou `ci/` pour extraire les métriques

---

## ✍️ Auteurs

Équipe 3 : Konan Thierry Kouadio, Ghita Aimarah, Hossein Kargar.

Contexte : Cours MGL843 – ÉTS – Hiver 2026
