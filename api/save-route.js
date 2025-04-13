let routes = new Map();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, data } = req.body;

    if (!userId || !data) {
      return res.status(400).json({ error: 'Missing userId or data' });
    }

    const routeId = userId.toString();
    routes.set(routeId, data);

    // Возвращаем URL маршрута
    const routeUrl = `https://georgia-webapp.vercel.app?userId=${routeId}`;
    res.status(200).json({ status: 'ok', routeUrl });
  }

  else if (req.method === 'GET') {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId in query' });
    }

    const data = routes.get(userId.toString());
    if (!data) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.status(200).json(data);
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
