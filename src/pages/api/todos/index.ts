import db from '@/database/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      db.all('SELECT * FROM todos', [], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.status(200).json(rows);
      });
      break;
    case 'POST': {
      const { title } = req.body;
      if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
      }
      db.run(
        'INSERT INTO todos (title, completed) VALUES (?, ?)',
        [title, false],
        function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.status(201).json({ id: this.lastID, title, completed: false });
        },
      );
      break;
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
