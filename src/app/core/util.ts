import { Subscription } from 'rxjs';

export class Util {
  public static unsubscribe(...subscriptions: Subscription[]): void {
    subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
