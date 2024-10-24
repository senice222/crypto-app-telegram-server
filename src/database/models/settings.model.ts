import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  DataTypes,
} from "sequelize";
import db from "../config/database.config";

export default class Settings extends Model<
  InferAttributes<Settings>,
  InferCreationAttributes<Settings>
> {
  declare readonly id: CreationOptional<number>;
  declare telegramChat: string;
  declare telegramSupportId: number;

  declare windowsDownloadLink: string;
  declare iosDownloadLink: string;
  declare androidDownloadLink: string;

  declare referralActivationAmount: number; //USD
  declare referralDiscount: number; //PERCENTAGE

  declare windowsAppVersion: number;

  declare specialOfferTime: number; //HOURS

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}
Settings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    telegramChat: {
      type: DataTypes.STRING(128),
    },
    telegramSupportId: {
      type: DataTypes.DOUBLE,
    },
    windowsDownloadLink: {
      type: DataTypes.STRING(255),
    },
    iosDownloadLink: {
      type: DataTypes.STRING(255),
    },
    androidDownloadLink: {
      type: DataTypes.STRING(255),
    },
    referralActivationAmount: {
      type: DataTypes.FLOAT,
    },
    referralDiscount: {
      type: DataTypes.FLOAT,
    },
    windowsAppVersion: {
      type: DataTypes.STRING,
    },
    specialOfferTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "settings",
    sequelize: db,
    timestamps: true,
  }
);
