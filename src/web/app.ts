import express from 'express';
import path from 'path';
import { FileNotesRepository } from '../persistence/NotesRepository';
import { NotesService } from '../services/NotesService';
import { buildRoutes } from './routes';

export function createApp(options?: { notesFile?: string }) {
  const app = express();

  // Body parsing (forms)
  app.use(express.urlencoded({ extended: true }));

  // Views (Pug)
  const viewsPath = path.join(__dirname, 'views');
  app.set('views', viewsPath);
  app.set('view engine', 'pug');

  // Dependencies
  const notesFile = options?.notesFile ?? path.join(__dirname, '../../notes.json');
  const repo = new FileNotesRepository(notesFile);
  const service = new NotesService(repo);

  // Routes
  app.use(buildRoutes(service));

  // Basic error handler
  app.use((err: any, _req: any, res: any, _next: any) => {
    const message = err?.message ?? 'Erreur inconnue';
    res.status(500).send(message);
  });

  return app;
}

// If launched directly: start server
if (require.main === module) {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  const notesFile = process.env.NOTES_FILE;
  const app = createApp({ notesFile });
  app.listen(port, () => console.log(`Notes web app running on http://localhost:${port}`));
}
