import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import db from "@database/config/database.config";
import User from "./user.model";
import Payment from "./payment.model";

export default class Promocode extends Model<
  InferAttributes<Promocode>,
  InferCreationAttributes<Promocode>
> {
  declare readonly id: CreationOptional<number>;
  declare userId: number;
  declare promocode: string;
  declare activations: CreationOptional<number>;
  declare revenue: CreationOptional<number>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare user?: NonAttribute<User>;
  declare payments?: NonAttribute<Payment[]>;
}

Promocode.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    promocode: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
    },
    activations: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    revenue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "promocodes",
    sequelize: db,
    timestamps: true,
  }
);
