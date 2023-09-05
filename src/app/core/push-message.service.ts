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
    this.init();
  }

  public init(): Promise<void> {
    if (!this.localSettingService.isUserGrantNotification) {
      return Promise.resolve();
    }

    this.firebaseApp = initializeApp(environment.firebase);
    this.messaging = getMessaging(); 

    return this.registerServiceWorker();
  }

  public registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return Promise.resolve();
    }


    return navigator.serviceWorker.getRegistration().then((registration) => {
      console.log('registration', registration);
      if (!registration) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js');
      }
  });
}

  public getToken(): Promise<string> {
    if (!this.messaging) {
      console.log('messaging is not initialized');
      return Promise.resolve(null);
    }

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
