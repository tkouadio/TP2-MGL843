import request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import { createApp } from '../src/web/app';

describe('Web Notes (Express + Pug) - E2E', () => {
  const tempNotesFile = path.join(__dirname, '../notes.e2e.test.json');

  beforeEach(() => {
    fs.writeFileSync(tempNotesFile, '[]', 'utf-8');
  });

  afterEach(() => {
    if (fs.existsSync(tempNotesFile)) fs.unlinkSync(tempNotesFile);
  });

  it('permet de créer une note via le frontend (POST /notes)', async () => {
    const app = createApp({ notesFile: tempNotesFile });

    const res = await request(app)
      .post('/notes')
      .type('form')
      .send({ title: 'Note Web', content: 'Contenu Web', tags: 'tag1, tag2' });

    expect(res.status).toBe(302); // redirect
    const data = JSON.parse(fs.readFileSync(tempNotesFile, 'utf-8'));
    expect(data.length).toBe(1);
    expect(data[0].title).toBe('Note Web');
    expect(data[0].tags).toContain('tag1');
  });

  it('permet d’ajouter et retirer un tag sur une note existante', async () => {
    const app = createApp({ notesFile: tempNotesFile });

    // Create note
    await request(app)
      .post('/notes')
      .type('form')
      .send({ title: 'Tags', content: 'Test', tags: '' });

    let data = JSON.parse(fs.readFileSync(tempNotesFile, 'utf-8'));
    const id = data[0].id;

    // Add tag
    await request(app)
      .post(`/notes/${id}/tags/add`)
      .type('form')
      .send({ tag: 'Important' });

    data = JSON.parse(fs.readFileSync(tempNotesFile, 'utf-8'));
    expect(data[0].tags).toContain('important');

    // Remove tag
    await request(app)
      .post(`/notes/${id}/tags/remove`)
      .type('form')
      .send({ tag: 'important' });

    data = JSON.parse(fs.readFileSync(tempNotesFile, 'utf-8'));
    expect(data[0].tags).not.toContain('important');
  });

  it('permet de modifier et supprimer une note', async () => {
    const app = createApp({ notesFile: tempNotesFile });

    // Create
    await request(app).post('/notes').type('form').send({ title: 'A', content: 'B', tags: '' });
    let data = JSON.parse(fs.readFileSync(tempNotesFile, 'utf-8'));
    const id = data[0].id;

    // Update
    await request(app).post(`/notes/${id}`).type('form').send({ title: 'A2', content: 'B2' });
    data = JSON.parse(fs.readFileSync(tempNotesFile, 'utf-8'));
    expect(data[0].title).toBe('A2');
    expect(data[0].content).toBe('B2');

    // Delete
    await request(app).post(`/notes/${id}/delete`).type('form').send({});
    data = JSON.parse(fs.readFileSync(tempNotesFile, 'utf-8'));
    expect(data.length).toBe(0);
  });
});
