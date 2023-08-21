importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');


firebase.initializeApp({
  apiKey: "AIzaSyDKhBZrAS0SSpiUO4Bhwy3k0aB1z8IsWNg",
  authDomain: "surreal-b57e6.firebaseapp.com",
  projectId: "surreal-b57e6",
  storageBucket: "surreal-b57e6.appspot.com",
  messagingSenderId: "108729747209",
  appId: "1:108729747209:web:abbac626a69b7dd141b5d8",
  measurementId: "G-GPSEYNWGBW"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});

