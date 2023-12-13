import { Subscription } from 'rxjs';

export class Util {
  public static unsubscribe(...subscriptions: Subscription[]): void {
    subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public static truncate(input: string, length: number): string {
    if (input.length > length) {
       return input.substring(0, length) + '...';
    }
    return input;
 };
}
