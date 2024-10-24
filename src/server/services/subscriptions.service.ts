import Subscription from "@/database/models/subscription.model";
import User from "@/database/models/user.model";
import UserSubscription from "@/database/models/userSubscription.model";

export interface ISubscriptionService {
  getAllSubscriptions(): Promise<Subscription[]>;
  getUserSubscriptions(userId: number): Promise<Subscription[]>;
}

export class SubscriptionService implements ISubscriptionService {
  public async getAllSubscriptions(): Promise<Subscription[]> {
    return Subscription.findAll();
  }

  public async getUserSubscriptions(userId: number): Promise<Subscription[]> {
    const user = await User.findOne({
      where: { userId },
    });

    if (!user) {
      console.error("User does not exist");
      return;
    }

    console.log(user.id);

    const userSubscriptions = await UserSubscription.findAll({
      where: { userId: user.id },
    });

    const subscriptionsWithDetails = [];

    for (const userSubscription of userSubscriptions) {
      const subscription = await Subscription.findOne({
        where: { id: userSubscription.subscriptionId },
      });

      const subscriptionData = {
        ...userSubscription.get(),
        subscription: subscription ? subscription.get() : null,
      };

      subscriptionsWithDetails.push(subscriptionData);
    }

    return subscriptionsWithDetails;
  }
}
