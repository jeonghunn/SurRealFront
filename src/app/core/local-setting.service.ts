import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalSettingService {

  public constructor() { }

  public get isUserDisallowedNotification(): boolean {
    return this.get('notification_permission') === 'false';
  }

  public set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public get(key: string): string {
    return localStorage.getItem(key);
  }

  public requestNotificationPermission(): void {
    Notification.requestPermission().then((permission: string) => {
      this.set('notification_permission', permission);
    });
  }

}
