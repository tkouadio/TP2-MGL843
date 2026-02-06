import * as path from 'path';
import { FileNotesRepository } from './persistence/NotesRepository';
import { NotesService } from './services/NotesService';

/**
 * Facade CLI (compatibilité TP1).
 * La logique métier est maintenant dans NotesService + Repository + Entité Note.
 */
export class NoteManager {
  private readonly service: NotesService;

  constructor(notesFile: string) {
    const repo = new FileNotesRepository(notesFile);
    this.service = new NotesService(repo);
  }

  loadNotes() {
    return this.service.list().map(n => n.toJSON());
  }

  createNote(title: string, content: string, tags: string[]) {
    this.service.create(title, content, tags);
    console.log('Note créée avec succès.');
  }

  listNotes() {
    const notes = this.service.list();
    if (notes.length === 0) {
      console.log('Aucune note trouvée.');
      return;
    }
    notes.forEach(note => {
      console.log(`#${note.id} - ${note.title} [${note.tags.join(', ')}]`);
    });
  }

  searchNotes(keyword: string) {
    const results = this.service.search(keyword);
    if (results.length === 0) {
      console.log('Aucune note trouvée pour ce mot-clé.');
      return;
    }
    results.forEach(note => {
      console.log(`#${note.id} - ${note.title} [${note.tags.join(', ')}]`);
    });
  }

  exportNotes(filename: string) {
    // Export: on réutilise les notes déjà en mémoire
    const notes = this.service.list().map(n => n.toJSON());
    const fs = require('fs');
    fs.writeFileSync(filename, JSON.stringify(notes, null, 2), 'utf-8');
    console.log(`Notes exportées dans ${filename}`);
  }

  addTag(noteId: number, tag: string) {
    this.service.addTag(noteId, tag);
  }

  removeTag(noteId: number, tag: string) {
    this.service.removeTag(noteId, tag);
  }

  updateNote(noteId: number, title: string, content: string) {
    this.service.update(noteId, { title, content });
  }

  deleteNote(noteId: number) {
    this.service.delete(noteId);
  }
}

function printHelp() {
  console.log(`\nCommandes disponibles :
  create <titre> <contenu> <tags, séparés par ,>
  list
  search <mot-clé>
  export <fichier.json>
  help
\n(Optionnel TP2)
  add-tag <id> <tag>
  remove-tag <id> <tag>
  update <id> <titre> <contenu>
  delete <id>
  web  (lance le serveur web Express+Pug)
`);
}

function main() {
  const NOTES_FILE = path.join(__dirname, '../notes.json');
  const noteManager = new NoteManager(NOTES_FILE);
  const [,, cmd, ...args] = process.argv;

  switch (cmd) {
    case 'create':
      if (args.length < 3) {
        console.log('Usage: create <titre> <contenu> <tags, séparés par ,>');
        break;
      }
      noteManager.createNote(args[0], args[1], args[2].split(','));
      break;

    case 'list':
      noteManager.listNotes();
      break;

    case 'search':
      if (args.length < 1) {
        console.log('Usage: search <mot-clé>');
        break;
      }
      noteManager.searchNotes(args[0]);
      break;

    case 'export':
      if (args.length < 1) {
        console.log('Usage: export <fichier.json>');
        break;
      }
      noteManager.exportNotes(args[0]);
      break;

    case 'add-tag':
      noteManager.addTag(Number(args[0]), String(args[1] ?? ''));
      break;

    case 'remove-tag':
      noteManager.removeTag(Number(args[0]), String(args[1] ?? ''));
      break;

    case 'update':
      noteManager.updateNote(Number(args[0]), String(args[1] ?? ''), String(args[2] ?? ''));
      break;

    case 'delete':
      noteManager.deleteNote(Number(args[0]));
      break;

    case 'web': {
      // Import here to keep CLI light
      const { createApp } = require('./web/app');
      const port = process.env.PORT ? Number(process.env.PORT) : 3000;
      const app = createApp({ notesFile: NOTES_FILE });
      app.listen(port, () => console.log(`Notes web app running on http://localhost:${port}`));
      break;
    }

    case 'help':
    default:
      printHelp();
  }
}

main();
