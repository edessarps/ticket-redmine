export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Si la clé manque, on renvoie [] sans planter
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(200).json({ questions: [] });
  }

  try {
    const { subject, extra, env } = req.body || {};
    const context = `Projet : ${env || ''}\nTitre du bug : ${subject || ''}\nDescription : ${extra || '(aucune description)'}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: `Tu es un assistant qui aide à compléter les rapports de bugs pour une équipe de développement web.
Analyse le rapport de bug et génère entre 1 et 3 questions TRÈS courtes et précises pour aider le développeur à reproduire et comprendre le bug.
Concentre-toi uniquement sur ce qui manque réellement dans la description.
Réponds UNIQUEMENT en JSON valide, sans aucun texte autour, sous ce format exact :
{"questions": ["Question 1 ?", "Question 2 ?", "Question 3 ?"]}
Maximum 3 questions. Minimum 1. Questions en français. Courtes et concrètes.`,
        messages: [{ role: 'user', content: context }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return res.status(200).json({ questions: [] }); // dégrade gracieusement
    }

    const data = await response.json();
    const raw = data.content.map(b => b.text || '').join('').trim();
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    return res.status(200).json({ questions: parsed.questions || [] });

  } catch (e) {
    console.error('ask error:', e.message);
    return res.status(200).json({ questions: [] }); // ne bloque jamais l'envoi
  }
}
