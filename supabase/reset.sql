-- =============================================================================
-- Magical Wardrobe — Réinitialisation complète de la base de données
-- =============================================================================
-- ⚠️  ATTENTION : ce script SUPPRIME toutes les données existantes.
-- Exécuter dans Supabase > SQL Editor
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Suppression des tables (ordre inverse des dépendances)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS picked_outfit CASCADE;
DROP TABLE IF EXISTS asso_vetement_tag CASCADE;
DROP TABLE IF EXISTS vetement CASCADE;
DROP TABLE IF EXISTS tag CASCADE;
DROP TABLE IF EXISTS type_vetement CASCADE;

-- ---------------------------------------------------------------------------
-- 2. Recréation des tables
-- ---------------------------------------------------------------------------

CREATE TABLE type_vetement (
  id_type SERIAL PRIMARY KEY,
  label VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tag (
  id_tag SERIAL PRIMARY KEY,
  label VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vetement (
  id_vetement SERIAL PRIMARY KEY,
  id_type INTEGER NOT NULL REFERENCES type_vetement(id_type),
  label VARCHAR(100) NOT NULL,
  description TEXT,
  pic_path VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE asso_vetement_tag (
  id_vetement INTEGER NOT NULL REFERENCES vetement(id_vetement) ON DELETE CASCADE,
  id_tag INTEGER NOT NULL REFERENCES tag(id_tag) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id_vetement, id_tag)
);

CREATE TABLE picked_outfit (
  id_outfit SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  id_haut INTEGER REFERENCES vetement(id_vetement) ON DELETE SET NULL,
  id_bas INTEGER REFERENCES vetement(id_vetement) ON DELETE SET NULL,
  id_ceinture INTEGER REFERENCES vetement(id_vetement) ON DELETE SET NULL,
  id_chaussure INTEGER REFERENCES vetement(id_vetement) ON DELETE SET NULL,
  id_veste INTEGER REFERENCES vetement(id_vetement) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3. Index utiles
-- ---------------------------------------------------------------------------
CREATE INDEX idx_vetement_id_type ON vetement(id_type);
CREATE INDEX idx_asso_vetement_tag_vetement ON asso_vetement_tag(id_vetement);
CREATE INDEX idx_asso_vetement_tag_tag ON asso_vetement_tag(id_tag);
CREATE INDEX idx_picked_outfit_date ON picked_outfit(date DESC);

-- ---------------------------------------------------------------------------
-- 4. Données de référence (types + tags)
-- ---------------------------------------------------------------------------
INSERT INTO type_vetement (id_type, label) VALUES
  (1, 'Haut'),
  (2, 'Bas'),
  (3, 'Ceinture'),
  (4, 'Chaussure'),
  (5, 'Veste');

INSERT INTO tag (id_tag, label) VALUES
  (1, 'Été'),
  (2, 'Hiver'),
  (3, 'Léger'),
  (4, 'Chaud'),
  (5, 'Casual'),
  (6, 'Streetwear'),
  (7, 'Gothique'),
  (8, 'Noir');

-- ---------------------------------------------------------------------------
-- 5. Réinitialisation des séquences auto-incrémentées
-- ---------------------------------------------------------------------------
SELECT setval('type_vetement_id_type_seq', (SELECT MAX(id_type) FROM type_vetement));
SELECT setval('tag_id_tag_seq', (SELECT MAX(id_tag) FROM tag));
SELECT setval('vetement_id_vetement_seq', 1, false);
SELECT setval('picked_outfit_id_outfit_seq', 1, false);

COMMIT;

-- Vérification
SELECT 'type_vetement' AS table_name, COUNT(*) AS rows FROM type_vetement
UNION ALL SELECT 'tag', COUNT(*) FROM tag
UNION ALL SELECT 'vetement', COUNT(*) FROM vetement
UNION ALL SELECT 'asso_vetement_tag', COUNT(*) FROM asso_vetement_tag
UNION ALL SELECT 'picked_outfit', COUNT(*) FROM picked_outfit;
