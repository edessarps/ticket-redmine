export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const REDMINE = 'https://redmine.rhinovplanner.com';
  const API_KEY = process.env.REDMINE_API_KEY;

  const { subject, description, priority_id, project_id, uploads } = req.body || {};

  const response = await fetch(`${REDMINE}/issues.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Redmine-API-Key': API_KEY
    },
    body: JSON.stringify({ issue: { project_id, subject, description, priority_id, uploads } })
  });

  const data = await response.json();
  if (!response.ok) return res.status(response.status).json(data);
  return res.status(201).json(data);
}
