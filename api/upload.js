export const config = { api: { bodyParser: { sizeLimit: '20mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Filename, X-Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const REDMINE = 'https://redmine.rhinovplanner.com';
  const API_KEY = process.env.REDMINE_API_KEY;
  const filename = req.headers['x-filename'] || 'file';
  const contentType = req.headers['x-content-type'] || 'application/octet-stream';

  // Body is base64 encoded file
  const { data: b64 } = req.body;
  const buffer = Buffer.from(b64, 'base64');

  const response = await fetch(`${REDMINE}/uploads.json`, {
    method: 'POST',
    headers: {
      'X-Redmine-API-Key': API_KEY,
      'Content-Type': 'application/octet-stream'
    },
    body: buffer
  });

  const data = await response.json();
  if (!response.ok) return res.status(response.status).json(data);
  return res.status(200).json({ token: data.upload.token, filename, content_type: contentType });
}
