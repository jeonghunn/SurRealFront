

importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js');
importScripts('assets/js/localforage.min.js')


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
let userId = null;

localforage.getItem('user_id').then(function(value) {
  userId = value;
});

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    image: payload.data.image,
    data: {
      url: payload.data.url,
    }
  };

  if(userId && userId.toString() === payload.data.user_id){
    return;
  }

  self.registration.showNotification(notificationTitle,
   notificationOptions);
});

function handleClick (event) {
  event.notification.close();
  // Open the url you set on notification.data
  clients.openWindow(event.notification.data.url).focus();
}
self.addEventListener('notificationclick', handleClick);


const channel4Broadcast = new BroadcastChannel('user_id');
channel4Broadcast.onmessage = (event) => {
  console.log('Received', event.data);
  userId = event.data;
}

