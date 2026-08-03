# Magical Wardrobe

Dressing connecté — frontend Nuxt + API Fastify + Supabase.

## Prérequis

- Node.js 20+
- Projet Supabase initialisé
- Fichier `.env` (copier depuis `.env.example`)

## Configuration Supabase

1. Dans Supabase → **SQL Editor**, exécuter le fichier `supabase/schema.sql`
2. Récupérer la **Connection string** (mode Transaction pooler, port 6543) dans Project Settings → Database
3. Coller l'URL dans `DATABASE_URL` du `.env`

## Lancement

```bash
npm install
npm run dev
```

Cela démarre simultanément :
- **API** Magical Wardrobe sur `http://localhost:3000`
- **Frontend** Nuxt sur `http://localhost:3001`

Code d'accès par défaut : `magical2026` (variable `NUXT_PUBLIC_DRESSING_ACCESS_CODE`).

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | API + frontend en parallèle |
| `npm run dev:api` | API seule |
| `npm run dev:web` | Frontend seul |
| `npm run build` | Build production Nuxt |
| `npm run start:api` | Démarrer l'API en production |

## Endpoints API

| Méthode | Route | Description |
|---|---|---|
| GET | `/health` | Santé de l'API |
| GET | `/vetements` | Liste des vêtements (`?tags=1,2&type=1`) |
| GET | `/vetements/:id` | Détail d'un vêtement |
| POST | `/vetements` | Créer un vêtement |
| GET | `/tags` | Liste des tags |
| GET | `/types` | Types de vêtements |
| GET | `/outfits` | Tenues enregistrées |
| POST | `/outfits` | Enregistrer une tenue |
| POST | `/upload` | Upload photo via l'API → R2 |
| GET | `/upload/status` | Vérifier la config R2 |

## Déploiement Render (gratuit)

Le projet nécessite **2 Web Services** Render (plan free) depuis le même repo :

| Service | Build | Start |
|---|---|---|
| `magical-wardrobe-api` | `npm install` | `npm run start:api` |
| `magical-wardrobe-web` | `npm install && npm run build:web` | `npm run start:web` |

Voir `render.yaml` pour un déploiement Blueprint automatique.

> **Important** : `NUXT_PUBLIC_*` doivent être définies **avant le build** du service web sur Render.
