// api/issue.js — Proxy création de ticket Redmine

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const redmineUrl  = process.env.REDMINE_URL;
  const redmineKey  = process.env.REDMINE_API_KEY;
  const projectId   = process.env.REDMINE_PROJECT_ID;

  if (!redmineUrl || !redmineKey || !projectId)
    return res.status(500).json({ error: 'Variables REDMINE_URL, REDMINE_API_KEY ou REDMINE_PROJECT_ID manquantes' });

  try {
    const { subject, description, priority_id, uploads } = req.body;

    const response = await fetch(`${redmineUrl}/issues.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Redmine-API-Key': redmineKey
      },
      body: JSON.stringify({
        issue: {
          project_id: projectId,
          subject,
          description,
          priority_id,
          uploads: uploads || []
        }
      })
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
