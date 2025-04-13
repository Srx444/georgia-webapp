import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./api/routes.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, data } = req.body;

    if (!userId || !data) {
      return res.status(400).json({ error: 'Missing userId or data' });
    }

    let routes = {};

    try {
      if (fs.existsSync(filePath)) {
        const jsonData = fs.readFileSync(filePath, 'utf8');
        routes = JSON.parse(jsonData);
      }
    } catch (error) {
      console.error('Error reading file:', error);
    }

    routes[userId] = data;

    try {
      fs.writeFileSync(filePath, JSON.stringify(routes, null, 2));
      return res.status(200).json({
        status: 'ok',
        routeUrl: `https://georgia-webapp.vercel.app?userId=${userId}`
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save route' });
    }
  }

  else if (req.method === 'GET') {
    const { userId } = req.query;

    try {
      const jsonData = fs.readFileSync(filePath, 'utf8');
      const routes = JSON.parse(jsonData);
      const data = routes[userId];

      if (!data) {
        return res.status(404).json({ error: 'Route not found' });
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to load route' });
    }
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
