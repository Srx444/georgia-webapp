import fs from 'fs';
import path from 'path';

const routesFilePath = path.resolve('./routes.json');

// Убедимся, что файл существует
function ensureRoutesFile() {
  if (!fs.existsSync(routesFilePath)) {
    fs.writeFileSync(routesFilePath, JSON.stringify({}), 'utf-8');
  }
}

// Получить все маршруты из файла
function readRoutes() {
  ensureRoutesFile();
  const fileData = fs.readFileSync(routesFilePath, 'utf-8');
  return JSON.parse(fileData);
}

// Сохранить все маршруты в файл
function writeRoutes(routes) {
  fs.writeFileSync(routesFilePath, JSON.stringify(routes, null, 2), 'utf-8');
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, data } = req.body;

    if (!userId || !data) {
      return res.status(400).json({ error: 'Missing userId or data' });
    }

    const routes = readRoutes();
    routes[userId.toString()] = data;
    writeRoutes(routes);

    const routeUrl = `https://georgia-webapp.vercel.app?userId=${userId}`;
    res.status(200).json({ status: 'ok', routeUrl });
  }

  else if (req.method === 'GET') {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId in query' });
    }

    const routes = readRoutes();
    const route = routes[userId.toString()];

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.status(200).json(route);
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
