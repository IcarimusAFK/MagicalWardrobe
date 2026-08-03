import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const TypeVetement = sequelize.define(
  'TypeVetement',
  {
    id_type: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    label: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  },
  {
    tableName: 'type_vetement',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
