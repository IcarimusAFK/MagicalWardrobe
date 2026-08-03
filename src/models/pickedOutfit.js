import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const PickedOutfit = sequelize.define(
  'PickedOutfit',
  {
    id_outfit: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    id_haut: { type: DataTypes.INTEGER, allowNull: true },
    id_bas: { type: DataTypes.INTEGER, allowNull: true },
    id_ceinture: { type: DataTypes.INTEGER, allowNull: true },
    id_chaussure: { type: DataTypes.INTEGER, allowNull: true },
    id_veste: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: 'picked_outfit',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
