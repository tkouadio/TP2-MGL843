import { NoteManager } from '../src/index';
import * as fs from 'fs';
import * as path from 'path';

describe('Notes CLI', () => {
  const NOTES_FILE = path.join(__dirname, '../notes.json');
  const backupFile = path.join(__dirname, '../notes.test.backup.json');
  let noteManager: NoteManager;

  beforeEach(() => {
    if (fs.existsSync(NOTES_FILE)) {
      fs.copyFileSync(NOTES_FILE, backupFile);
    }
    fs.writeFileSync(NOTES_FILE, '[]', 'utf-8');
    noteManager = new NoteManager(NOTES_FILE);
  });

  afterEach(() => {
    if (fs.existsSync(backupFile)) {
      fs.copyFileSync(backupFile, NOTES_FILE);
      fs.unlinkSync(backupFile);
    }
  });

  it('crée une note', () => {
    noteManager.createNote('Test', 'Contenu', ['tag1', 'tag2']);
    const notes = noteManager.loadNotes();
    expect(notes.length).toBe(1);
    expect(notes[0].title).toBe('Test');
    expect(notes[0].tags).toContain('tag1');
  });

  it('recherche une note par mot-clé', () => {
    noteManager.createNote('Alpha', 'Bravo', ['tag1']);
    noteManager.createNote('Beta', 'Charlie', ['tag2']);
    // Recherche par mot-clé dans le titre
    const notes = noteManager.loadNotes();
    const results = notes.filter((note: any) =>
      note.title.includes('Alpha') ||
      note.content.includes('Alpha') ||
      note.tags.some((tag: any) => tag.includes('Alpha'))
    );
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Alpha');
  });

  it('recherche une note par tag', () => {
    noteManager.createNote('Gamma', 'Delta', ['important']);
    const notes = noteManager.loadNotes();
    const results = notes.filter((note: any) =>
      note.title.includes('important') ||
      note.content.includes('important') ||
      note.tags.some((tag: any) => tag.includes('important'))
    );
    expect(results.length).toBe(1);
    expect(results[0].tags).toContain('important');
  });

  it('exporte les notes dans un fichier', () => {
    noteManager.createNote('Export', 'Contenu export', ['exp']);
    const exportFile = path.join(__dirname, '../notes.export.test.json');
    noteManager.exportNotes(exportFile);
    expect(fs.existsSync(exportFile)).toBe(true);
    const data = JSON.parse(fs.readFileSync(exportFile, 'utf-8'));
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
    expect(data[0].title).toBe('Export');
    fs.unlinkSync(exportFile);
  });

  it('affiche la liste des notes', () => {
    noteManager.createNote('Liste', 'Contenu liste', ['list']);
    // Capture console output
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    noteManager.listNotes();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Liste'));
    spy.mockRestore();
  });
});
