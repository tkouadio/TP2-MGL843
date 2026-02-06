import * as fs from 'fs';
import * as path from 'path';
import { Note, NoteProps } from '../domain/Note';

export interface INotesRepository {
  getAll(): Note[];
  saveAll(notes: Note[]): void;
}

/**
 * Repository de notes stockées dans un fichier JSON.
 * - Encapsule la lecture/écriture fichier (SRP).
 * - Peut être substitué plus tard (DB, API, etc.).
 */
export class FileNotesRepository implements INotesRepository {
  private readonly notesFile: string;

  constructor(notesFile: string) {
    this.notesFile = notesFile;
  }

  getAll(): Note[] {
    if (!fs.existsSync(this.notesFile)) return [];
    const raw = fs.readFileSync(this.notesFile, 'utf-8').trim();
    if (!raw) return [];
    const data = JSON.parse(raw) as NoteProps[];
    return data.map(d => new Note(d));
  }

  saveAll(notes: Note[]): void {
    const dir = path.dirname(this.notesFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const payload = notes.map(n => n.toJSON());
    fs.writeFileSync(this.notesFile, JSON.stringify(payload, null, 2), 'utf-8');
  }
}
