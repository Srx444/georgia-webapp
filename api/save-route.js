let routes = new Map();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, data } = req.body;
    routes.set(userId.toString(), data);
    res.status(200).json({ status: 'ok' });
  } else if (req.method === 'GET') {
    const userId = req.query.userId;
    const data = routes.get(userId) || {};
    res.status(200).json(data);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
