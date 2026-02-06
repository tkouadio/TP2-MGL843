/**
 * (Legacy TP1) Fonctions utilitaires.
 * Conservé pour compatibilité, mais la version TP2 utilise NotesService + Repository.
 */
import * as path from 'path';
import { FileNotesRepository } from './persistence/NotesRepository';
import { NotesService } from './services/NotesService';

const NOTES_FILE = path.join(__dirname, '../notes.json');
const service = new NotesService(new FileNotesRepository(NOTES_FILE));

export function loadNotes() {
  return service.list().map(n => n.toJSON());
}

export function createNote(title: string, content: string, tags: string[]) {
  return service.create(title, content, tags).toJSON();
}

export function searchNotes(keyword: string) {
  return service.search(keyword).map(n => n.toJSON());
}

export function listNotes() {
  return service.list().map(n => n.toJSON());
}
