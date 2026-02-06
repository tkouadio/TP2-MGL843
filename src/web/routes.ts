import { Router } from 'express';
import { NotesService } from '../services/NotesService';

export function buildRoutes(service: NotesService) {
  const router = Router();

  router.get('/', (_req, res) => res.redirect('/notes'));

  // List + search
  router.get('/notes', (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    const notes = q ? service.search(q) : service.list();
    res.render('index', { notes, q });
  });

  // New note form
  router.get('/notes/new', (_req, res) => {
    res.render('note_form');
  });

  // Create
  router.post('/notes', (req, res) => {
    const title = String(req.body.title ?? '');
    const content = String(req.body.content ?? '');
    const tagsRaw = String(req.body.tags ?? '');
    const tags = tagsRaw.split(',').map((t: string) => t.trim()).filter(Boolean);
    service.create(title, content, tags);
    res.redirect('/notes');
  });

  // Edit form
  router.get('/notes/:id/edit', (req, res) => {
    const id = Number(req.params.id);
    const note = service.getById(id);
    if (!note) return res.status(404).send('Note introuvable');
    res.render('note_edit', { note });
  });

  // Update
  router.post('/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    const title = String(req.body.title ?? '');
    const content = String(req.body.content ?? '');
    service.update(id, { title, content });
    res.redirect(`/notes/${id}/edit`);
  });

  // Delete
  router.post('/notes/:id/delete', (req, res) => {
    const id = Number(req.params.id);
    service.delete(id);
    res.redirect('/notes');
  });

  // Add tag
  router.post('/notes/:id/tags/add', (req, res) => {
    const id = Number(req.params.id);
    const tag = String(req.body.tag ?? '');
    service.addTag(id, tag);
    res.redirect(`/notes/${id}/edit`);
  });

  // Remove tag
  router.post('/notes/:id/tags/remove', (req, res) => {
    const id = Number(req.params.id);
    const tag = String(req.body.tag ?? '');
    service.removeTag(id, tag);
    res.redirect(`/notes/${id}/edit`);
  });

  return router;
}
