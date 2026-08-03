import { sequelize } from '../config/database.js';
import { Vetement } from './vetement.js';
import { Tag } from './tag.js';
import { TypeVetement } from './typeVetement.js';
import { PickedOutfit } from './pickedOutfit.js';

// --- Vetement <-> Tag (many-to-many via asso_vetement_tag) ---
Vetement.belongsToMany(Tag, {
  through: 'asso_vetement_tag',
  foreignKey: 'id_vetement',
  otherKey: 'id_tag',
  timestamps: true,
  underscored: true,
});

Tag.belongsToMany(Vetement, {
  through: 'asso_vetement_tag',
  foreignKey: 'id_tag',
  otherKey: 'id_vetement',
  timestamps: true,
  underscored: true,
});

// --- Vetement -> TypeVetement (many-to-one) ---
Vetement.belongsTo(TypeVetement, { foreignKey: 'id_type' });
TypeVetement.hasMany(Vetement, { foreignKey: 'id_type' });

export { sequelize, Vetement, Tag, TypeVetement, PickedOutfit };
