let routes = {};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { userId, data } = req.body;

      if (!userId || !data) {
        return res.status(400).json({ error: 'Missing userId or data' });
      }

      routes[userId.toString()] = data;

      // Вернём ссылку на маршрут
      const routeUrl = `https://georgia-webapp.vercel.app/?userId=${userId}`;
      return res.status(200).json({ status: 'ok', routeUrl });
    } catch (error) {
      console.error("Save error:", error);
      return res.status(500).json({ error: 'Failed to save route' });
    }
  }

  else if (req.method === 'GET') {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId in query' });
      }

      const data = routes[userId.toString()];
      if (!data) {
        return res.status(404).json({ error: 'Route not found' });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Get error:", error);
      return res.status(500).json({ error: 'Failed to load route' });
    }
  }

  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
