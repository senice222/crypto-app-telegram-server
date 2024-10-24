import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  DataTypes,
  NonAttribute,
} from "sequelize";
import db from "../config/database.config";

type TPaymentType = "quarter" | "lifetime";
type TSubscriptionType = "exclusive" | "platinum" | "regular";

//TODO: LOW
//Сделать правильно по документации
export interface ICreateSubscription {
  id: CreationOptional<number>;
  name: string;
  price: number;
  discount: number;
  blockchains: number;
  paymentType: TPaymentType;
  properties: string[];
  subscriptionType: TSubscriptionType;
  readonly createdAt: CreationOptional<Date>;
  readonly updatedAt: CreationOptional<Date>;
}

export default class Subscription extends Model<
  InferAttributes<Subscription>,
  InferCreationAttributes<Subscription>
> {
  declare readonly id: CreationOptional<number>;
  declare name: string;
  declare price: number;
  declare discount: number;
  declare blockchains: number;
  declare paymentType: TPaymentType;
  declare properties: string[];
  declare subscriptionType: TSubscriptionType;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare userSubscriptions?: NonAttribute<any[]>;
  declare payments?: NonAttribute<any[]>;

  get priceWithDiscount(): NonAttribute<number> {
    const price = parseFloat(String(this.price || 0));
    const discount = parseFloat(String(this.discount || 0));
    const validatedDiscount = discount >= 0 && discount <= 100 ? discount : 0;
    const finalPrice = price - (price * validatedDiscount) / 100;

    return Math.round(finalPrice * 100) / 100;
  }
}

Subscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    blockchains: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    paymentType: {
      type: DataTypes.ENUM("quarter", "lifetime"),
      allowNull: false,
    },
    properties: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    subscriptionType: {
      type: DataTypes.ENUM("exclusive", "platinum", "regular"),
      allowNull: false,
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
    tableName: "subscriptions",
    sequelize: db,
    timestamps: true,
  }
);
