-- Magical Wardrobe — schéma Supabase (PostgreSQL)
-- Exécuter dans Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS type_vetement (
  id_type SERIAL PRIMARY KEY,
  label VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tag (
  id_tag SERIAL PRIMARY KEY,
  label VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vetement (
  id_vetement SERIAL PRIMARY KEY,
  id_type INTEGER NOT NULL REFERENCES type_vetement(id_type),
  label VARCHAR(100) NOT NULL,
  description TEXT,
  pic_path VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS asso_vetement_tag (
  id_vetement INTEGER NOT NULL REFERENCES vetement(id_vetement) ON DELETE CASCADE,
  id_tag INTEGER NOT NULL REFERENCES tag(id_tag) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id_vetement, id_tag)
);

CREATE TABLE IF NOT EXISTS picked_outfit (
  id_outfit SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  id_haut INTEGER REFERENCES vetement(id_vetement) ON DELETE SET NULL,
  id_bas INTEGER REFERENCES vetement(id_vetement) ON DELETE SET NULL,
  id_ceinture INTEGER REFERENCES vetement(id_vetement) ON DELETE SET NULL,
  id_chaussure INTEGER REFERENCES vetement(id_vetement) ON DELETE SET NULL,
  id_veste INTEGER REFERENCES vetement(id_vetement) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Données de référence
INSERT INTO type_vetement (id_type, label) VALUES
  (1, 'Haut'),
  (2, 'Bas'),
  (3, 'Ceinture'),
  (4, 'Chaussure'),
  (5, 'Veste')
ON CONFLICT (label) DO NOTHING;

INSERT INTO tag (id_tag, label) VALUES
  (1, 'Été'),
  (2, 'Hiver'),
  (3, 'Léger'),
  (4, 'Chaud'),
  (5, 'Casual'),
  (6, 'Streetwear'),
  (7, 'Gothique'),
  (8, 'Noir')
ON CONFLICT (label) DO NOTHING;

SELECT setval('type_vetement_id_type_seq', (SELECT MAX(id_type) FROM type_vetement));
SELECT setval('tag_id_tag_seq', (SELECT MAX(id_tag) FROM tag));
