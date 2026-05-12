export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const REDMINE = 'https://redmine.rhinovplanner.com';
  const API_KEY = process.env.REDMINE_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'REDMINE_API_KEY manquante dans les variables Vercel' });
  }

  try {
    const { subject, description, priority_id, project_id, uploads } = req.body || {};

    const payload = { issue: { project_id, subject, description, priority_id } };
    if (uploads && uploads.length > 0) payload.issue.uploads = uploads;

    const response = await fetch(`${REDMINE}/issues.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Redmine-API-Key': API_KEY
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!response.ok) {
      console.error('Redmine error', response.status, text);
      return res.status(response.status).json({ error: `Redmine ${response.status}`, detail: data });
    }

    return res.status(201).json(data);

  } catch (e) {
    console.error('create-issue error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
