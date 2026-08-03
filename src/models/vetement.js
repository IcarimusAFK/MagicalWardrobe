import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Vetement = sequelize.define(
  'Vetement',
  {
    id_vetement: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_type: { type: DataTypes.INTEGER, allowNull: false },
    label: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT },
    pic_path: { type: DataTypes.STRING(255) },
  },
  {
    tableName: 'vetement',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
