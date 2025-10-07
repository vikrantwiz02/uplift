export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({ 
    status: 'OK', 
    message: 'Uplift API is running',
    timestamp: new Date().toISOString()
  });
}