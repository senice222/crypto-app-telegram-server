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
import { BLOCKCHAIN_VALUES, TBlockchains } from "./payment.model";

export default class UserSubscription extends Model<
  InferAttributes<UserSubscription>,
  InferCreationAttributes<UserSubscription>
> {
  declare readonly id: CreationOptional<number>;
  declare userId: number;
  declare subscriptionId: number;
  declare expiresAt: Date | null;
  declare blockchains: TBlockchains[];
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare user?: NonAttribute<User>;
  declare subscription?: NonAttribute<Subscription>;
}

UserSubscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    subscriptionId: {
      type: DataTypes.INTEGER,
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
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "user_subscriptions",
    sequelize: db,
    timestamps: true,
  }
);
