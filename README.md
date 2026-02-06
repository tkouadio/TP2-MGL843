# TP2 – Évaluer la qualité d’un projet TypeScript  
**MGL843 – Sujets avancés en conception logicielle**

## 📌 Description
Ce projet est une évolution du **TP1** dans le cadre du cours **MGL843**.  
L’objectif du **TP2** est d’augmenter la complexité du projet afin d’évaluer la **qualité de la conception logicielle**, en introduisant de nouvelles exigences (FURPS), une architecture plus orientée objets et une interface Web.

Le projet consiste en une **application de gestion de notes** permettant :
- la création, la modification et la suppression de notes,
- la gestion de tags associés aux notes,
- la recherche par titre, contenu ou tag,
- l’interaction via une interface Web développée avec **Pug**.

---

## 🎯 Objectifs du TP2
- Ajouter de nouvelles exigences fonctionnelles et non fonctionnelles (FURPS)
- Refactoriser le projet vers une architecture orientée objets
- Générer un modèle **FamixTypeScript** pour l’analyse avec Moose
- Évaluer la qualité de la conception à l’aide de métriques
- Visualiser et analyser ces métriques

---

## 🧩 Architecture du projet
Le projet est structuré en plusieurs responsabilités distinctes :

```

src/
├── domain/
│   └── Note.ts                # Entité métier (note + tags)
├── persistence/
│   └── FileNotesRepository.ts # Accès aux données (fichier JSON)
├── services/
│   └── NotesService.ts        # Logique métier
├── web/
│   ├── controllers/
│   ├── views/                 # Templates Pug
│   ├── routes.ts
│   └── app.ts                 # Application Express
├── index.ts                   # Point d’entrée / façade
tests/
└── *.test.ts                  # Tests automatisés

````

Cette séparation améliore la **maintenabilité**, la **testabilité** et la **supportabilité** du système.

---

## 🚀 Fonctionnalités
- Interface Web avec **Express + Pug**
- Ajout, modification et suppression de notes via le frontend
- Ajout et suppression de tags sur une note
- Recherche par titre, contenu ou tag
- Persistance des données dans un fichier JSON
- Tests automatisés (Jest)

---

## 🛠️ Technologies utilisées
- **TypeScript**
- **Node.js**
- **Express**
- **Pug**
- **Jest**
- **Moose / FamixTypeScript**
- **ts2famix**

---

## ▶️ Installation et exécution

### Prérequis
- Node.js (v18 ou plus recommandé)
- npm

### Installation
```bash
npm install
````

### Lancer l’application Web

```bash
npm run dev:web
```

Puis ouvrir :

```
http://localhost:3000/notes
```

### Build (optionnel)

```bash
npm run build
npm run start:web
```

---

## 🧪 Tests

Lancer les tests automatisés :

```bash
npm test
```

---

## 📊 Analyse de la qualité

* Le modèle Famix est généré à partir du code TypeScript du TP2 :

```bash
ts2famix -i tsconfig.json -o TP2-MGL843-model.json
```

* Le modèle est importé dans **Moose** afin d’analyser :

  * la complexité du système,
  * la répartition des responsabilités,
  * les relations entre classes,
  * les métriques de conception.

---

## ✍️ Auteur

TP réalisé dans le cadre du cours MGL843 – Sujets avancés en conception logicielle ÉTS – Hiver 2026

---
