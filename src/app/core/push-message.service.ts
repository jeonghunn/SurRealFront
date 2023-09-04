import { Injectable } from '@angular/core';
import { getMessaging, getToken } from "firebase/messaging";
import { environment } from 'src/environments/environment';
import { initializeApp } from "firebase/app";
import { LocalSettingService } from './local-setting.service';

@Injectable({
  providedIn: 'root'
})
export class PushMessageService {

  public messaging: any = null;
  public firebaseApp: any = null;


  public constructor(
    private localSettingService: LocalSettingService,
  ) {
    this.registerServiceWorker();
    this.firebaseApp = initializeApp(environment.firebase);
    this.messaging = getMessaging(); 
    
  }

  public registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator) || this.localSettingService.isUserDisallowedNotification) return;

    return navigator.serviceWorker.getRegistration().then((registration) => {
      console.log('registration', registration);
      if (!registration) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js');
      }
  });
}

  public getToken(): Promise<string> {
    return getToken(this.messaging, { vapidKey: environment.firebaseVapidKey }).then((currentToken: string) => {
      if (currentToken) {
        console.log('currentToken', currentToken);
        return currentToken;
      } else {
        console.log('No registration token available. Request permission to generate one.');
        return null;
      }
    }).catch((err: any) => {
      console.log('An error occurred while retrieving token. ', err);
      return null;
    });
  }
}
