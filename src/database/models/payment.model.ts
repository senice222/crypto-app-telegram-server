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
import Subscription from "./subscription.model";

type TPaymentStatus = "pending" | "completed" | "failed";
export type TBlockchains = "btc" | "eth" | "usdt" | "ltc" | "sol" | "bnb";
export const BLOCKCHAIN_VALUES: TBlockchains[] = [
  "btc",
  "eth",
  "usdt",
  "ltc",
  "sol",
  "bnb",
];

export const BlockchainsEnum = DataTypes.ENUM(...BLOCKCHAIN_VALUES);

export default class Payment extends Model<
  InferAttributes<Payment>,
  InferCreationAttributes<Payment>
> {
  declare readonly id: CreationOptional<number>;
  declare userId: number;
  declare subscriptionId: number;
  declare amount: number;
  declare promocodeId?: number;
  declare status: TPaymentStatus;
  declare blockchains: TBlockchains[];
  declare invoiceId: string;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare user?: NonAttribute<User>;
  declare subscription?: NonAttribute<Subscription>;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    subscriptionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "subscriptions",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    promocodeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "promocodes",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    invoiceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blockchains: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        isValidBlockchainArray(value: string[]) {
          const invalid = value.filter(
            (v) => !BLOCKCHAIN_VALUES.includes(v as TBlockchains)
          );
          if (invalid.length > 0) {
            throw new Error(`Invalid blockchain values: ${invalid.join(", ")}`);
          }
        },
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "payments",
    sequelize: db,
    timestamps: true,
  }
);
