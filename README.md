# Rhinov — Outil de tickets Redmine

Outil interne de création de tickets Redmine avec analyse IA des descriptions.

## Structure

```
rhinov-tickets/
├── vercel.json          # Config Vercel (routing)
├── api/
│   ├── ask.js           # Proxy → Anthropic API (questions IA)
│   ├── create-issue.js  # Proxy → Redmine (création ticket)
│   └── upload.js        # Proxy → Redmine (pièces jointes)
└── public/
    └── index.html       # Interface utilisateur
```

## Déploiement sur Vercel

### 1. Installer Vercel CLI (une seule fois)
```bash
npm install -g vercel
```

### 2. Depuis le dossier du projet :
```bash
vercel
```
Suivre les instructions (login, nom du projet, etc.)

### 3. Ajouter les variables d'environnement

Dans le dashboard Vercel → Settings → Environment Variables :

| Variable             | Valeur                                     |
|----------------------|--------------------------------------------|
| REDMINE_API_KEY      | 19be5358a8536e28337598da9fddda2c38ac8f32  |
| ANTHROPIC_API_KEY    | (ta clé API Anthropic)                     |

Ou via CLI :
```bash
vercel env add REDMINE_API_KEY
vercel env add ANTHROPIC_API_KEY
```

### 4. Redéployer après les variables
```bash
vercel --prod
```

## Clé API Anthropic

Obtenir une clé : https://console.anthropic.com/settings/keys

## Notes

- Les clés API ne sont jamais exposées côté client.
- Pièces jointes : limite 20 Mo par fichier.
- PROJECT_ID : identifiant Redmine du projet (visible dans l'URL).
