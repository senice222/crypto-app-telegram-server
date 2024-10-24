import Payment from "./payment.model";
import Promocode from "./promocode.model";
import Subscription from "./subscription.model";
import User from "./user.model";
import UserSubscription from "./userSubscription.model";

User.hasMany(UserSubscription, { foreignKey: "userId", as: "subscriptions" });
UserSubscription.belongsTo(User, { foreignKey: "userId", as: "user" });

Subscription.hasMany(UserSubscription, {
  foreignKey: "subscriptionId",
  as: "userSubscriptions",
});
UserSubscription.belongsTo(Subscription, {
  foreignKey: "subscriptionId",
  as: "subscription",
});

User.hasMany(Payment, { foreignKey: "userId", as: "payments" });
Payment.belongsTo(User, { foreignKey: "userId", as: "user" });

Subscription.hasMany(Payment, { foreignKey: "subscriptionId", as: "payments" });
Payment.belongsTo(Subscription, {
  foreignKey: "subscriptionId",
  as: "subscription",
});

User.hasOne(Promocode, { foreignKey: "userId", as: "promocode" });
Promocode.belongsTo(User, { foreignKey: "userId", as: "user" });

Promocode.hasMany(Payment, { foreignKey: "promocodeId", as: "payments" });
Payment.belongsTo(Promocode, { foreignKey: "promocodeId", as: "promocode" });
