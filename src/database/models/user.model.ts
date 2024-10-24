import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import db from "@database/config/database.config";
import Promocode from "./promocode.model";

export type TLanguages =
  | "en"
  | "fr"
  | "es"
  | "de"
  | "it"
  | "cn"
  | "tr"
  | "ru"
  | "pt"
  | "in";

export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare readonly id: CreationOptional<number>;
  declare readonly userId: number;
  declare username: string | null;
  declare firstName: string | null;
  declare lastName: string | null;
  declare isAdmin: CreationOptional<boolean>;
  declare isBanned: CreationOptional<boolean>;
  declare language: CreationOptional<TLanguages>;
  declare presetPromocode: CreationOptional<string>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare subscriptions?: NonAttribute<any[]>;
  declare payments?: NonAttribute<any[]>;
  declare promocode?: NonAttribute<Promocode>;

  get fullName(): NonAttribute<string> {
    return `${this.firstName || ""} ${this.lastName || ""}`;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: true,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    presetPromocode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    language: {
      type: DataTypes.ENUM(
        "en",
        "fr",
        "es",
        "de",
        "it",
        "cn",
        "tr",
        "ru",
        "pt",
        "in"
      ),
      allowNull: false,
      defaultValue: "en",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "users",
    sequelize: db,
    timestamps: true,
  }
);
