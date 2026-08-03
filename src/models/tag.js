import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Tag = sequelize.define(
  'Tag',
  {
    id_tag: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    label: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  },
  {
    tableName: 'tag',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
